import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import datetime


# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': 'intricate-reef-291721',
})
db = firestore.client()

# Add initial data
doc_ref = db.collection('use_case').document('hospital_operations')
doc_ref.set({
    'created_at': datetime.datetime.now(),
    'verified':True,
    'vertical': 'Healthcare',
    'horizontal': 'Operations',
    'lookml_project_id': 'healthcare',
    'name': 'Hopsital Operations',
    'description': 'Understand opportunities to increase hospital revenue, reduce costs, and continue to provide quality care to patients while maintaining privacy and ensuring secure data access',
    'dev_instance': 'https://demoexpo.looker.com',
    'tags':['Nested Data', 'Google Healthcare API'],
    'overview_dashboard_slug':'feLFb25D6JjKic14MdPKhb',
    'new_banner':{
        'type':'Use Case',
        'last_updated_at':datetime.datetime.now()
    }
})

subdoc_ref = doc_ref.collection("links").document()
subdoc_ref.set({
        'created_at': datetime.datetime.now(),
        'link':'https://docs.google.com/presentation/d/1AIr3zAw1l1Qio6ByS45ByqSl2hkMvrDZzjIcONNSeQQ/edit#slide=id.g74a76ef22c_0_564',
        'name':'Day in the Life',
        'description':'DITL deck for a healthcare operations analyst',
        'type':'drive',
        'shareable':True
})

subdoc_ref = doc_ref.collection("links").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://docs.google.com/presentation/d/1k2ryDQu6fxxDnzIZbDg3vg75MxOmsruHb63EPckgE2g/edit#slide=id.g73b1ac7bfd_0_277',
    'name':'Explore Q & A',
    'description':'Q&A to help users learn about the explore',
    'type':'drive',
    'shareable':True
})

subdoc_ref = doc_ref.collection("links").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://docs.google.com/presentation/d/1k2ryDQu6fxxDnzIZbDg3vg75MxOmsruHb63EPckgE2g/edit#slide=id.g73b1ac7bfd_0_277',
    'name':'Demo Scipt',
    'description':'Script for giving the healthcare operations demo',
    'type':'drive'
})

subdoc_ref = doc_ref.collection("links").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://docs.google.com/presentation/d/1k2ryDQu6fxxDnzIZbDg3vg75MxOmsruHb63EPckgE2g/edit#slide=id.g73b1ac7bfd_0_277',
    'name':'Healthcare Dataset',
    'description':'Information on the healthcare demo dataset',
    'type':'drive',
})

subdoc_ref = doc_ref.collection("links").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://www.youtube.com/watch?v=puXk4Cz-QGQ',
    'name':'Recorded Webinar',
    'description':'Recording of healthcare analytics webinar demo',
    'type':'video',
    'featured_video':True,
    'shareable':True
    })


subdoc_ref = doc_ref.collection("looker").document('dashboard_feLFb25D6JjKic14MdPKhb')
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'id': 273,
    'slug':'feLFb25D6JjKic14MdPKhb',
    'index':0,
    'is_overview':True,
    'type':'dashboard'
})


subdoc_ref = doc_ref.collection("looker").document('dashboard_TU4SBUVLvW1gDzfwCms2ji')
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'id': 286,
    'slug':'TU4SBUVLvW1gDzfwCms2ji',
    'index':1,
    'type':'dashboard',
})


# subdoc_ref = doc_ref.collection("boards").document('prod_board')
# subdoc_ref.set({
#     'created_at': datetime.datetime.now(),
#     'id': 286,
#     'dashboard_slug':'TU4SBUVLvW1gDzfwCms2ji',
#     'index':1,
#      'type':'dashboard',
# })


# subdoc_ref = doc_ref.collection("boards").document('dev_board')
# subdoc_ref.set({
#     'created_at': datetime.datetime.now(),
#     'dev_dashboard_id': 286,
#     'dashboard_slug':'TU4SBUVLvW1gDzfwCms2ji',
#     'index':1,
#      'type':'dashboard',
# })



doc_ref = db.collection('use_case').document('device_monitoring')
doc_ref.set({
    'created_at': datetime.datetime.now(),
    'verified':True,
    'vertical': 'Healthcare',
    'horizontal': 'IT',
    'lookml_project_id': 'healthcare',
    'name': 'Hopsital Device Monitoring',
    'description': 'Quickly find anomalies in vitals measured by nurses & devices, take action on the findings to determine the root cause of potential errors and improve data accuracy',
    'dev_instance': 'https://demoexpo.looker.com',
    'tags':['Real-Time','Google Healthcare API','BQML'],
    'overview_dashboard_slug':'bvOc0o9ZCXxYpk6N2AOxS5',
    'new_banner':{
        'type':'Use Case',
        'last_updated_at':datetime.datetime.now()
    }
})


subdoc_ref = doc_ref.collection("looker").document('dashboard_bvOc0o9ZCXxYpk6N2AOxS5')
subdoc_ref.set({
    'type':'dashboard',
    'created_at': datetime.datetime.now(),
    'id': 270,
    'slug':'bvOc0o9ZCXxYpk6N2AOxS5',
    'index':0,
    'is_overview':True
})

subdoc_ref = doc_ref.collection("looker").document('dashboard_vyXnb2W5dPGRLmjmsm45nH')
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'type':'dashboard',
    'id': 275,
    'slug':'vyXnb2W5dPGRLmjmsm45nH',
    'index':1
})

subdoc_ref = doc_ref.collection("looker").document('dashboard_8EphDRYy4nsFisbvUY4KRq')
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'type':'dashboard',
    'id': 277,
    'slug':'8EphDRYy4nsFisbvUY4KRq',
    'index':2
})


subdoc_ref = doc_ref.collection("looker").document('dashboard_ImdKtumpYGDKsZqKdGcacG')
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'type':'dashboard',
    'id': 278,
    'slug':'ImdKtumpYGDKsZqKdGcacG',
    'index':3,
    # 'tags':['Data Science']
})


doc_ref = db.collection('use_case').document('credit_card_product_marketing')
doc_ref.set({
    'created_at': datetime.datetime.now(),
    # 'last_updated_at':datetime.datetime.now(),
    'vertical': 'Financial Services',
    'horizontal': 'Product',
    'lookml_project_id': 'retail_banking',
    'name': 'Credit Card Product Marketing',
    'description': 'Marketing managers can get an overview for how each of the different credit cards are performing and what customer segmentations exist for each one. They can use this information to make decisions about new points offerings and campaigns to acquire new customers',
    'dev_instance': 'https://demoexpo.looker.com',
    'tags':['Point-in-Time Analysis'],
    'overview_dashboard_slug':'7QMprcICQHCGIOARQ7LHbx',
    'new_banner':{
        'type':'Use Case',
        'last_updated_at':datetime.datetime(2020,8,19,5,30)
    }
})

subdoc_ref = doc_ref.collection("decks").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://docs.google.com/presentation/d/1DP5i8qyc9o3CEz3ztSvmyZo2WsHQZParY6iLuBPrOJo/edit#slide=id.g71accad20c_9_276',
    'type':'Day in the Life'})

subdoc_ref = doc_ref.collection("videos").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://www.youtube.com/watch?v=puXk4Cz-QGQ#action=share',
    'type':'Webinar Recording'
    })

subdoc_ref = doc_ref.collection("decks").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'link':'https://docs.google.com/presentation/d/1k2ryDQu6fxxDnzIZbDg3vg75MxOmsruHb63EPckgE2g/edit#slide=id.g73b1ac7bfd_0_277',
    'type':'Explore Q & A'
    })

subdoc_ref = doc_ref.collection("dashboards").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'id': 304,
    'dashboard_slug':'7QMprcICQHCGIOARQ7LHbx',
    })

subdoc_ref = doc_ref.collection("dashboards").document()
subdoc_ref.set({
    'created_at': datetime.datetime.now(),
    'dev_dashboard_id': 325,
    'dashboard_slug':'WIrk7cojLJoQg2n1hiXw4O',
})

# Add initial vertical data
doc_ref = db.collection('vertical').document('Healthcare')
doc_ref.set({
    'created_at': datetime.datetime.now(),
    'last_updated_at':datetime.datetime.now(),
    'vertical': 'Healthcare',
    'emoji':'🏨'
})

doc_ref = db.collection('vertical').document('Financial Services')
doc_ref.set({
    'created_at': datetime.datetime.now(),
    'last_updated_at':datetime.datetime.now(),
    'vertical': 'Healthcare',
    'emoji':'🏦'
})


doc_ref = db.collection('verticals').document('all_verticals')
doc_ref.set({
    'vertical_list':['Healthcare']
})





