import { Fieldset, FieldCheckbox, FieldTextArea, Space, FieldSelect, Grid, InputText, Select, FieldToggleSwitch, Tooltip, Heading, Box, Tabs, TabList, TabPanel, 
    TabPanels, Tab, Paragraph, Accordion,  AccordionDisclosure, AccordionContent, Form, FieldText, Button, SpaceVertical, FieldSelectMulti } from '@looker/components'
import React, { useEffect, useContext } from "react"
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { stringify } from 'querystring'


export default function Logger(){
    const [newLookML, setLookMLOn] = React.useState(false)
    const [newUseCase, setUseCaseOn] = React.useState(false)
    const [projectsLoading, setProjectsLoading] = React.useState(true)
    const [namesLoading, setNamesLoading] = React.useState(true)
    const [projectOptions, setProjectOptions]= React.useState<any[]>([])
    const [nameOptions, setNameOptions]= React.useState<any[]>([{'value':'Healthcare Operations'},{'value':'Hopsital Device Monitoring'},{'value':'Credit Card Marketing'}])
    const [lookerContent, setlookerContentContent] = React.useState<any[]>([])
    const [otherContent, setotherContentContent] = React.useState<any[]>([])
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK

    // get project names from the API
    useEffect(()=>{
        if(!newLookML && projectOptions.length<1){
            console.log('in effect')
            const getProjects = async () => {
                try {
                    const projList = await sdk.ok(sdk.all_projects());
                    if(projList){
                        var projectIds:any[] = [];
                        projList.forEach((p)=> 
                        // take out marketplace projects for now
                            {
                                if(p.id?.indexOf('marketplace') === -1){
                                    projectIds.push({'value':p.id})
                            }}
                        )
                        setProjectsLoading(false);
                        setProjectOptions(projectIds);
                    }
                }catch(err){
                    console.log('Problem retrieving the dashboard ', err)
                }
        }
        getProjects();
        }
    },[newLookML])


    // const addContent = (e:any, type:string) => {
    //     e.preventDefault();
    //     var newContentList: any[] = [];
    //     if(type==='looker'){
    //         content.forEach( (val: any) => 
    //        {newContentList.push(Object.assign({}, val))})

    //     }
    //     //    add a new elment
    //     newContentList.push({"type":type})
    //     setContent(newContentList);
    //     console.log('my content ', newContentList)
    // }

    // get use case names from firestore
    
    return(
        // paddingLeft="50" paddingRight="50"
        <Box marginTop="1rem">
            <Form>
            <Grid columns={2}>
                {/* First see if the user wants to create a new use case or use an existing one */}
                <Box position="relative" display="flex" justifyContent="space-between" >
                    <Box width="50%" marginRight="1rem">
                            {newUseCase ? 
                                <FieldText label="Use Case Name"  placeholder="Add a name for your demo (e.g. Healthcare Operations)"/> 
                            :<>
                            {namesLoading ? <FieldSelect label="Use Case Name" placeholder="Loading use case names.." isLoading/> : 
                            <FieldSelect label="Use Case Name" options={projectOptions} placeholder="Select your use case"/>
                            }</>}
                        </Box>
                        <Box flexGrow={1} position="relative">
                            <Box top="50%" position="absolute" display="flex">
                                <Tooltip content="This demo is a new use case that we're adding">
                                    <FieldToggleSwitch label="New Use Case" onChange={(e:any) => {setUseCaseOn(e.target.checked)}} on={newUseCase} />
                                </Tooltip>
                                <Tooltip content="Looker demo team should verify this content and upload to productions instances">
                                    <FieldToggleSwitch label="Verify Demo" onChange={(e:any) => {setUseCaseOn(e.target.checked)}} on={newUseCase} />
                                </Tooltip>
                            </Box>
                        </Box>
                </Box>
                    {lookerContent.map((value, index)=> <> {value.type === 'looker' ?  <FiledSet legend="Looker Content">
                        <LookerForm  key={index} index={index} setContent={setContent} content={content}/></FiledSet>: <></>} </>)}
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
            </Grid>
            </Form>
            <Box>
                <Grid columns={3}>
                    <Button color="neutral" onClick={(e)=>addContent(e,"looker")}>Add Looker Content</Button>
                    <Button color="neutral" onClick={(e)=>addContent(e,"other")}>Add Other Links</Button>
                    <Button color="key">Submit Demo</Button>
                </Grid>
            </Box>
        </Box>
    )}


    export function LookerForm(props:any){
        const [type, setType] = React.useState('')
        const [id, setID] = React.useState('')
        const [isOverview, setOverview] = React.useState('')
        const lookerContentTypes = [{'value':'dashboard'},{'value':'look'},{'value':'extension'}]
        // get from firestore
        const lookerTags = [{'value':'BQML'},{'value':'Cross Filtering'}]


        return(
            <Fieldset accordion legend={"Looker Content #"+ String(props.index +1)} defaultOpen>
                <FieldSelect label="Content Type" options={lookerContentTypes} value={type}
                placeholder="Choose your content type" onChange={(e:any)=>{setType(e.target.checked)}} required/> 
                <Tooltip content="This is the ID for the content on the instance you created it, you can find it from the URL">
                    <FieldText label={"Content ID"}  
                    placeholder="Enter the ID for your content"
                    value={id} onChange={(e:any)=>{setID(e.target.checked)}} required/>
                </Tooltip>
                { type === 'dashboard' ?  <FieldCheckbox label="Overview Dashboard" onChange={(e:any) => {setOverview(e.target.checked)}} value={isOverview}/> : <></>}
                <FieldSelectMulti
                    options={lookerTags}
                    isFilterable
                    placeholder="Enter a new tag or select from the list"
                    freeInput
                    label="Tags">
                </FieldSelectMulti>
                </Fieldset>
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