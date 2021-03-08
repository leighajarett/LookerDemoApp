import { IconButton, Divider, Fieldset, FieldCheckbox, FieldTextArea, Space, FieldSelect, Grid, InputText, Select, FieldToggleSwitch, Tooltip, Heading, Box, Tabs, TabList, TabPanel, 
    TabPanels, Tab, Paragraph, Accordion,  AccordionDisclosure, AccordionContent, Form, FieldText, Button, SpaceVertical, FieldSelectMulti } from '@looker/components'
import React, { useEffect, useContext } from "react"
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { stringify } from 'querystring'
import { identity } from 'lodash'
import { AnyNaptrRecord } from 'dns'
import { DateTimeFormatProps } from '@looker/components/lib/DateTimeFormat'

interface Record {
    name: string,
    description: string,
    dev_instance: string,
    git_repo: string,
    lookml_project_id: string,
    horizontal: string,
    vertical: string,
    tags: string[],
    verified: 'true' | 'false' | 'in progress',
    // created_at?: string
}    

export default function Logger(props:any){
    // if content is loading
    const [loading, setLoading] = React.useState(true)
    // form inputs that will be used to create a new document in firestore
    const [demoRecord, setRecord] = React.useState<Record>({
        name: '',
        description: '',
        dev_instance: '',
        git_repo: '',
        lookml_project_id: '',
        horizontal: '',
        vertical: '',
        tags: [], 
        verified: 'false'
        // created_at: '',
    })
    // available options retreived from firestore
    const [nameOptions, setNameOptions]= React.useState<any[]>([])
    const [horizontalOptions, setHorizontals]= React.useState<any[]>([])
    const [verticalOptions, setVerticals]= React.useState<any[]>([])
    const [tagOptions, setTags]= React.useState<any[]>([])
    // is this a new use case or not
    const [newUseCase, setUseCaseOn] = React.useState(false)
    // should the demo be verified by demo team
    const [verify, setVerify] = React.useState(false)
    // content associate with this demo - either looker content or external content
    const [lookerContent, setLookerContent] = React.useState<any[]>([])
    const [otherContent, setOtherContent] = React.useState<any[]>([])

    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK

    // on load get metadata from firestore 
    useEffect(()=>{
        // query firestore to get all unique verticals
        const getDemos = async (collectionRef: any) => {
            try{
                // get all the documents
                const querySnapshot = await collectionRef.orderBy("new_banner.last_updated_at", "desc").get();
                // var allDemos:any[] = [];
                var allUseCases:any[] = [];
                var allVerticals:string[] = [];
                var allVerticalOptions:any[] = [];
                var allHoriztonals:string[] = [];
                var allHorizontalOptions:any[] = [];
                var allTags:string[] = [];
                var allTagOptions:any[] = [];
                if(querySnapshot){
                    querySnapshot.forEach((doc: any) => {
                        const data = doc.data()
                        data["id"]=doc.id;
                        // allDemos.push(data);
                        allUseCases.push({value:doc.id,label:data['name'], description:'Project Name: ' + data['lookml_project_id']})
                        if(allVerticals.indexOf(data["vertical"]) < 0){
                            allVerticals.push(data['vertical'])
                            allVerticalOptions.push({value:data['vertical']})
                        }
                        // add the horizontals and make all the intiial filter
                        if(allHoriztonals.indexOf(data["horizontal"]) < 0){
                            allHoriztonals.push(data['horizontal'])
                            allHorizontalOptions.push({value:data['horizontal']})
                        }
                        // add the tags and make all the intiial filter
                        for(var i=0;i<data['tags'].length;i++){
                            if(allTags.indexOf(data["tags"][i]) < 0){
                                allTags.push(data['tags'][i])
                                allTagOptions.push({value:data['tags'][i]})
                            }
                        }
                    })
                }
                setNameOptions(allUseCases)
                setVerticals(allVerticalOptions);
                setHorizontals(allHorizontalOptions);
                setTags(allTagOptions);
                setLoading(false);
            }catch(err){
                console.log('Problem getting demos: ',err)
            }
        }
        getDemos(props.firestore);
    }
    ,[])

    // update the state record (which will be written back to firestore eventually)
    const updateRecord = (key: (keyof Record), value: string | string[] | boolean) => {
        // e.preventDefault();
        var newRecord = Object.assign({}, demoRecord) as Record;
        (newRecord as any)[key] = value;
        setRecord(newRecord);
    }

    // update the record for verification if the end user requests verify
    useEffect(()=>{
        if(verify){
            updateRecord('verified', 'in progress')
        }
        else{
            updateRecord('verified', 'false')
        }
    },[verify])


    const addContent = (e:any, arr:any[], setArr: (a: any[]) => any) => {
        e.preventDefault();
        var newContentList: any[] = [];
        arr.forEach( (val: any) => {newContentList.push(Object.assign({}, val))});
        newContentList.push({});
        setArr(newContentList);
    }

    const submitForm = (e:any) => {
        e.preventDefault();
        // make ID
        var demo_id = demoRecord['name'].toLowerCase().replace(' ', '')
        var new_record = Object.assign({}, demoRecord) as any
        new_record['created_at'] = new Date;
        console.log(new_record)
        // if its a brand new use case
        if(newUseCase){
            new_record['new_banner'] = {'last_updated_at': new Date,'type':'Use Case'}
            props.firestore.doc(demo_id).set(new_record)
                .then(function() {
                    console.log("Document successfully written!");
                })
                .catch(function(error:any) {
                    console.error("Error writing document: ", error);
                });
        }
        else{
            // update the banner to show new content that was added
            var new_type =''
            if(lookerContent.length > 0){
                new_type = 'Dashboards'
            }
            else if(otherContent.length>0){
                new_type = 'Content'
            }
            if(new_type.length>0){
                props.firestore.doc(demo_id).update(
                    {
                        "new_banner.last_updated_at": new Date,
                        "new_banner.type": new_type
                    }
                ) 
            }
        }
        if(lookerContent.length > 0){
            lookerContent.forEach((val, index)=>{
                var looker_id = val['type'] + '_' + val['id']
                val['created_at'] = new Date;
                val['index'] = index;
                props.firestore.doc(demo_id).collection("looker").doc(looker_id).set(val)
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error:any) {
                        console.error("Error adding looker doc: ", error);
                    });
            }
        )
        }
        if(otherContent.length > 0){
            otherContent.forEach((val)=>{
                val['created_at'] = new Date;
                var newLinkRef = props.firestore.doc(demo_id).collection("links").doc();
                newLinkRef.set(val)
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error:any) {
                        console.error("Error adding link doc: ", error);
                    });
            })
        }
        // update parent component state when form is submitted
        props.submit(true)
    }

    return(
        <>
        <Paragraph fontSize="small" fontStyle="italic">Fill out this form for each use case in your demo, one LookML project can have many use cases, but each use can can only correspond to one LookML project. Each use case can contain multiple pieces of Looker content and/or external links. The development instance is where you actually build and develop your demo (e.g. googlecloud.looker.com or demoexpo.looker.com), if you opt to have your demo verified it will be ported into CI/ CD workflows that make it available on trial.looker, googledemo and partnerdemo</Paragraph>
        <Box marginTop="1rem">
            <Form onSubmit={submitForm}> 
                <Grid columns={2}>
                    <Grid columns={2}>
                        <Box marginRight="1rem">
                                {newUseCase ? 
                                    <FieldText label="Use Case Name"  placeholder="Name for your new demo" 
                                    required value={demoRecord['name']} onChange={(e:any) => {updateRecord('name', e.target.value)}}/> 
                                :<>
                                {loading ? <FieldSelect required label="Use Case Name" placeholder="Loading use cases.." isLoading/> : 
                                <FieldSelect required value={demoRecord['name']} onChange={(e:any) => {updateRecord('name', e)}} label="Use Case Name" options={nameOptions} placeholder="Select your use case / LookML Project"/>
                                }</>}
                        </Box>
                        <Box flexGrow={1} position="relative">
                            <Box top="50%" position="absolute" display="flex">
                                <Tooltip content="This demo is a new use case that we're adding">
                                    <FieldToggleSwitch  label="New Use Case" onChange={(e:any) => {setUseCaseOn(e.target.checked)}} on={newUseCase} />
                                </Tooltip>
                                {newUseCase ? 
                                <Tooltip content="Looker demo team should verify this content and upload to productions instances">
                                    <FieldToggleSwitch label="Verify Demo" onChange={(e:any) => {setVerify(e.target.checked)}} on={verify} />
                                </Tooltip> : <></>}
                            </Box>
                        </Box>
                        <Box>
                            {newUseCase ? <FieldText required label="LookML Project Name"  placeholder="Name of project in Looker" 
                                        value={demoRecord['lookml_project_id']} onChange={(e:any) => {updateRecord('lookml_project_id', e.target.value)}}/> : <></>}
                        </Box>
                        <Box>
                            {newUseCase ? <FieldText required label="Git Repository"  placeholder="SSH URL for LookML git repo" 
                                        value={demoRecord['git_repo']} onChange={(e:any) => {updateRecord('git_repo', e.target.value)}}/> 
                                : <></>}
                        </Box>
                    </Grid>
                    <Box>
                        {newUseCase ?  <FieldTextArea required label="Use Case Description"  placeholder="2-3 sentences description of your demo" 
                                        value={demoRecord['description']} onChange={(e:any) => {updateRecord('description', e.target.value)}}/>  :<></>}
                    </Box>
                    <Grid columns={2}>
                        {/* horizontal and vertical */}
                        {newUseCase ? 
                        <>
                            <FieldText
                                placeholder="e.g. https://demoexpo.looker.com"
                                label="Development Instance"
                                onChange={(e:any) => {updateRecord('dev_instance', e.target.value)}}
                                value={demoRecord['dev_instance']}
                                required
                                >
                            </FieldText>
                            <FieldSelect
                                options={verticalOptions}
                                isFilterable
                                placeholder="Select or enter a vertical"
                                // freeInput
                                label="Vertical"
                                onChange={(e:any) => {updateRecord('vertical', e)}}
                                value={demoRecord['vertical']}
                                showCreate
                                >
                            </FieldSelect>
                        </> : <></>}
                    </Grid>
                    <Grid columns={2}>
                        {/* tags */}
                        {newUseCase ? 
                        <>
                            <FieldSelect
                            options={horizontalOptions}
                            isFilterable
                            placeholder="Select or enter a horizontal"
                            label="Horizontal"
                            onChange={(e:any) => {updateRecord('horizontal', e)}}
                            value={demoRecord['horizontal']}
                            showCreate
                            >
                            </FieldSelect>
                            <FieldSelectMulti
                                    options={tagOptions}
                                    isFilterable
                                    placeholder="Select and/or tags that can be used to search for your demo"
                                    freeInput
                                    label="Tags"
                                    values={demoRecord['tags']}
                                    onChange={(e:any) => {updateRecord('tags', e)}}>
                                </FieldSelectMulti> 
                        </>
                        : <></>}
                        
                    </Grid>
                    <ContentList legend="Looker Content" contentList={lookerContent} setContent={setLookerContent}/>
                    <ContentList legend="Other Content" contentList={otherContent} setContent={setOtherContent}/>
                </Grid>
            <Box>
                <Grid columns={3}>
                    <Button color="neutral" onClick={(e)=>addContent(e,lookerContent,setLookerContent)}>Add Looker Content</Button>
                    <Button color="neutral" onClick={(e)=>addContent(e,otherContent, setOtherContent)}>Add Other Links</Button>
                    <Button color="key">Submit</Button>
                </Grid>
            </Box>
            </Form>
        </Box>
        </>
    )
}

export function ContentList(props:{legend: string, contentList: any[], setContent: (a: any[]) => any}){
    // updates the content list in the parent component
        const updateContent = (index: number, newValue: any, del:boolean) => {
            var newContentList: any[] = [];
            // make a copy of the array so that react will recognize the state has been changed
            props.contentList.forEach( (val: any) => {newContentList.push(Object.assign({}, val))});
            newContentList[index] = newValue;
            // if the object should be deleted, pop it from list
            if(del){newContentList.splice(index,1)}
            props.setContent(newContentList);
        }

        if(props.contentList.length > 0){
            return(
                <Box display="flex">
                    <Fieldset legend={props.legend}>
                            {props.contentList.map((value:any, index:number)=>{ 
                                if(props.legend.indexOf('Looker') > -1){
                                    return(<LookerForm  key={index} index={index} updateContent={updateContent}/>)
                                }
                                else{
                                    return(<OtherForn  key={index} index={index} updateContent={updateContent}/>)
                                }
                            })}
                    </Fieldset>
                </Box>
            )
        }
        else{
            return(
                <></>
            )
        }
    }

export function LookerForm(props:any){
    const [type, setType] = React.useState('')
    const [id, setID] = React.useState('')
    const [name, setName] = React.useState('')
    const [del, setDelete] = React.useState(false)
    const lookerContentTypes = [{'value':'dashboard'},{'value':'look'},{'value':'extension'}]

    useEffect(()=>{
        props.updateContent(props.index, {'type': type, 'id': id, 'name':name}, del)
    },[type,id,name, del])

    return(
        // <Fieldset accordion legend={"Looker Content #"+ String(props.index +1)} defaultOpen>
        <Accordion>
            <AccordionDisclosure><IconButton onClick={()=>setDelete(true)} marginRight=".5em" icon="Trash" label="Remove"/>{"Looker Content #"+ String(props.index +1)}</AccordionDisclosure>
            <AccordionContent>
                <Grid width="100%" columns={3}>
                    <FieldSelect label="Content Type" options={lookerContentTypes} value={type}
                        placeholder="Choose your content type" onChange={setType} required/> 
                    <Tooltip content="This is the ID for the content on the instance you created it, you can find it from the URL">
                        <FieldText label={"Content ID"}  
                        placeholder="Enter the ID for your content"
                        value={id} onChange={(e:any)=>{setID(e.target.value)}} required/>
                    </Tooltip>
                    <FieldText label="Content Name" value={name}
                        placeholder="e.g. Name of Dashboard" onChange={(e:any)=>{setName(e.target.value)}} required/> 
                    
                </Grid>
            </AccordionContent>
        </Accordion>
    )
}

export function OtherForn(props:any){
    const [description, setDescription] = React.useState('')
    const [link, setLink] = React.useState('')
    const [name, setName] = React.useState('')
    const [canShare, setShare] = React.useState(true)
    const [type, setType] = React.useState('')
    const [del, setDelete] = React.useState(false)
    const otherContentTypes = [{'value':'video'},{'value':'drive'},{'value':'other'}]

    useEffect(()=>{
        props.updateContent(props.index, {'type': type, 'description': description, 'name':name,'link':link, 'shareable':canShare}, del)
    },[type,description,name, link, canShare, del])


    return(
        <Accordion>
            <AccordionDisclosure><IconButton onClick={()=>setDelete(true)} marginRight=".5em" icon="Trash" label="Remove"/>{"Other Content #"+ String(props.index +1)}</AccordionDisclosure>
            <AccordionContent>
                <Grid width="100%" columns={3}>
                    <FieldSelect label="Content Type" options={otherContentTypes} value={type}
                        placeholder="Type of content" onChange={setType} required/> 
                    <FieldText label="Content Name" value={name}
                        placeholder="Name for Link" onChange={(e:any)=>{setName(e.target.value)}} required/> 
                    <Box flexGrow={1} position="relative">
                        <Box top="50%" position="absolute" display="flex">
                            <Tooltip content="We can/should share this content with prospective customers">
                                <FieldToggleSwitch label="Shareable" onChange={(e:any) => {setShare(e.target.checked)}} on={canShare} />
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>
                <Grid width= "100%" columns={2}>
                    <FieldText label="Link" value={link}
                        placeholder="URL for accessing" onChange={(e:any)=>{setLink(e.target.value)}} required/> 
                    <FieldText label="Description" value={description}
                        placeholder="Brief description of content" onChange={(e:any)=>{setDescription(e.target.value)}} required/> 
                </Grid>
            </AccordionContent>
        </Accordion>
    )
}




    // 'link':'https://docs.google.com/presentation/d/1AIr3zAw1l1Qio6ByS45ByqSl2hkMvrDZzjIcONNSeQQ/edit#slide=id.g74a76ef22c_0_564',
    // 'name':'Day in the Life',
    // 'description':'DITL deck for a healthcare operations analyst',
    // 'type':'drive',
    // 'shareable':True
    // tags

    // export  function OtherForm(props:any){
    //     // get types from firestore
    //     const otherTypes = [{'value':'video'},{'value':'drive'}]
    //     const [name, setName]=React.useState('')
    //     const [description, setDescription]=React.useState('')
    //     // get tags from firestore
    //     const otherTags = [{'value':'video'},{'value':'drive'}]

    //     return(
    //         <FieldSelect  label={"Other Content Type"+String(props.index)} 
    //         options={otherTypes} placeholder="Choose or add your content type"/> 
    //         <FieldText label={"Other Content "+String(props.index)} 
    //         options={otherTypes} placeholder="Choose or add your content type"/> 
    //     )
    // }


        // get project names from the API
    // useEffect(()=>{
    //     if(!newLookML && projectOptions.length<1){
    //         console.log('in effect')
    //         const getProjects = async () => {
    //             try {
    //                 const projList = await sdk.ok(sdk.all_projects());
    //                 if(projList){
    //                     var projectIds:any[] = [];
    //                     projList.forEach((p)=> 
    //                     // take out marketplace projects for now
    //                         {
    //                             if(p.id?.indexOf('marketplace') === -1){
    //                                 projectIds.push({'value':p.id})
    //                         }}
    //                     )
    //                     setProjectsLoading(false);
    //                     setProjectOptions(projectIds);
    //                 }
    //             }catch(err){
    //                 console.log('Problem retrieving the dashboard ', err)
    //             }
    //     }
    //     getProjects();
    //     }
    // },[newLookML])


    // const [newLookML, setLookMLOn] = React.useState(false)
    // const [projectsLoading, setProjectsLoading] = React.useState(true)
    // const [projectOptions, setProjectOptions]= React.useState<any[]>([])    


    // stuff
    {/* <Fieldset legend="Looker Content">

                    </Fieldset>
                    {lookerContent.map((value, index)=> <> {value.type === 'looker' ?  
                                    <LookerForm  key={index} index={index} setContent={setContent} content={content}/>
                               } </>)} */}



                    {/* <FiledSet>
                        {content.map((value, index)=> <> {value.type === 'other' ?  <OtherForm  key={index} index={index} setContent={setContent} content={content}/> : <></>} </>)}
                    </FiledSet> */}
                    {/* <Box position="relative" display="flex" justifyContent="space-between" >
                        <Box width="70%" marginRight="1rem">
                            {newLookML ? <FieldText label="LookML Project Name"  placeholder="Add the name of your LookML project"/> 
                            :<>
                            {projectsLoading ? <FieldSelect label="LookML Project Name" placeholder="Loading project names.." isLoading/> : 
                            <FieldSelect label="LookML Project Name" options={projectOptions} placeholder="Loading project names.."/>
                            }</>}
                        </Box>
                        <Box flexGrow={1} position="relative">
                            <Box top="50%" position="absolute">
                                <Tooltip content="This demo requires a new LookML project not currently on this instance">
                                    <FieldToggleSwitch label="New Project" onChange={(e:any) => {setLookMLOn(e.target.checked)}} on={newLookML} />
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                    {newUseCase ? 
                        <FieldTextArea label="Use Case Description"  placeholder="Add a short description for your demo" 
                    validationMessage={{ message: 'This should only be 1 short paragraph' }}/> : <></>} */}
                    {/* {newLookML ? 
                        <FieldText label="Use Case Description"  placeholder="Add a short description for your demo" 
                    validationMessage={{ message: 'This should only be 1 short paragraph' }}/> : <></>} */}



// loading stuff
// {newUseCase ? 
//     <FieldText label="Use Case Name"  placeholder="Add name for demo (e.g. Healthcare Operations)"/> 
// :<>
// {namesLoading ? <FieldSelect label="Use Case Name" placeholder="Loading use case names.." isLoading/> : 
// <FieldSelect label="Use Case Name" options={nameOptions} placeholder="Select your use case"/>
// }</>}