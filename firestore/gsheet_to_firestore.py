''' This file brings over the demo directory data stored in GSheets over into firestore'''

from googleapiclient.discovery import build
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

#firestore auth
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': 'intricate-reef-291721',
})

db = firestore.client()
col_ref = db.collection('env').document('prod').collection('demo')

#google sheet setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = '1lMIePBdUeFVf-wVu29m5h--B-dOZXJJyIiU07q6fCRQ'
USECASE_RANGE = 'Demo Use Cases!A3:P76'
CORE_RANGE = 'Core Demos!A2:S15'
DASHBOARD_RANGE = 'Demo Dashboards!A2:O76'

service = build('sheets', 'v4')
sheet = service.spreadsheets()
usecase_values = sheet.values().get(spreadsheetId=SPREADSHEET_ID,range=USECASE_RANGE).execute().get('values', [])
core_values = sheet.values().get(spreadsheetId=SPREADSHEET_ID,range=CORE_RANGE).execute().get('values', [])
dashboard_values = sheet.values().get(spreadsheetId=SPREADSHEET_ID,range=DASHBOARD_RANGE).execute().get('values', [])

#reformat the core_values and dashboard_values to be dictionaries for easier lookup
core_dict = {}
for core_demo in core_values[1:]:
    core_dict[core_demo[0]] = core_demo

dash_dict = {}
for dash in dashboard_values[1:]:
    if dash[1] not in dash_dict:
        dash_dict[dash[1]] = [dash]
    else:
         dash_dict[dash[1]] += [dash]


#helper function to setup subcollections
def set_subcoll(arr,subcol, doc_ref):
    for el in arr:
        if subcol =='prod_instances':
            doc_ref.collection(subcol).document(el['prod_instance'].split('/')[2].split('.')[0]).set(el)
        elif subcol =='looker':
             doc_ref.collection(subcol).document('dash_'+str(el['dev_id'])).set(el)
        else:
            doc_ref.collection(subcol).document().set(el)

#iterate through each demo and reformat the sheets data, then push into firestore
demo_instances = ['https://trial.looker.com','https://demo.looker.com','https://demoexpo.looker.com','https://partnerdemo.corp.looker.com','https://googledemo.looker.com']
demos = []
d = {}
for value in usecase_values[1:]:
    links = []
    demo_instances = []
    datasets = []
    dashboards = []

    for i,n in enumerate(['vertical','board_section_id','name','explore_start']):
        if len(value) > i+1 and len(value[i+1])>0:
            if n == 'explore_start':
                if len(value) > 6:
                    d[n] = value[6]
            else:
                d[n] = value[i+1]
                if n=='name':
                    d['demo_id'] = ''.join(c.lower() for c in value[i+1]).replace(' ','_')

    if len(value)>15:
        d['description'] = value[15]

    #handle links
    ditl_l = {}
    if len(value) > 4 and len(value[4]) > 0:
        ditl_l['created_at'] = datetime.datetime(2021,1,1)
        ditl_l['description'] = 'Day in the life deck with walkthroughs of common user flows'
        ditl_l['link'] = value[4]
        ditl_l['name'] = 'Day in the Life'
        ditl_l['shareable'] = True
        ditl_l['type'] = 'drive'
        links.append(ditl_l)

    ex_qa_l ={}
    if len(value) > 5 and len(value[5]) > 0:
        ex_qa_l['created_at'] = datetime.datetime(2021,1,1)
        ex_qa_l['description'] = 'Explore question and answer packets'
        ex_qa_l['link'] = value[4]
        ex_qa_l['name'] = 'Explore Q&A'
        ex_qa_l['shareable'] = True
        ex_qa_l['type'] = 'drive'
        links.append(ex_qa_l)


    #get info from core demos
    if value[0] in core_dict:
        core_values = core_dict[value[0]]
        if len(core_values) > 3: 
            d['lookml_project_name'] = core_values[3]
            if len(core_values) > 5:
                d['dev_instance'] = core_values[5]
                if len(core_values) > 14:
                    d['repo_name_ssh'] = 'git@github.com:' + core_values[14][1:] + '.git'
    
        #handle bq
        if len(core_values) > 9 and len(core_values[9])>0:
            for dataset in core_values[9].split(','):
                ds = {}
                ds['project'] = core_values[8]
                ds['dataset'] = dataset
                datasets.append(ds)

    #get dashboards
    if d['name'] in dash_dict:
        for i,dash in enumerate(dash_dict[d['name']]):
            d_ = {}
            if len(dash) > 5:
                d_['created_at'] = datetime.datetime(2021,1,1)
                d_['dev_id'] = int(dash[4])
                d_['slug'] = dash[5]
                d_['type'] = 'dashboard'
                d_['index'] = i
                if i == 0:
                    d_['is_overview']=True
                    d['overview_dashboard_slug'] = dash[5]
            if len(dash) > 14:
                d_['model'] = dash[14]
            dashboards.append(d_)
    
    #handle boards and folders
    
    folders = {'https://trial.looker.com':12,'https://partnerdemo.corp.looker.com':11,'https://googledemo.looker.com':10}
    for i,instance in enumerate(['https://trial.looker.com','https://partnerdemo.corp.looker.com','https://googledemo.looker.com']):
        x = {}
        #just use the last dash
        if len(dash) > folders[instance] and len(dash[folders[instance]]) > 0:
            x['folder_id'] = int(dash[folders[instance]])
            x['prod_instance'] = instance
            if len(value) > 11+i and len(value[11+i]) >0:
                x['board_id'] = int(value[11+i])
            demo_instances.append(x)
    
    if len(value) > 10 and len(value[10])>0 :
        d['dev_board'] = int(value[10])

    # horizontal
    # tags: []

    # print(d)
    # print('links: ', links)
    # print('instances: ', demo_instances)
    # print('dashboards: ', dashboards)
    # print('datasets: ', datasets)

    d['verified'] = "True"
    d['created_at'] = datetime.datetime(2021,1,1)
    d['new_banner'] = {
        'type' : 'Use Case',
        'last_updated_at':datetime.datetime(2021,1,1)
    }
    d['users_to_notify'] = ['leighaj@google.com', 'alick@google.com']

    #push to firestore
    doc_ref = col_ref.document(d['demo_id'])
    doc_ref.set(d)

    set_subcoll(links, "links",doc_ref)
    set_subcoll(demo_instances, "prod_instances",doc_ref)
    set_subcoll(datasets, "datasets",doc_ref)
    set_subcoll(dashboards, "looker",doc_ref)





   




    




