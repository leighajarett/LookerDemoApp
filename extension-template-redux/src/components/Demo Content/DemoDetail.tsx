import React, { useState, useContext, useEffect } from "react"
import { Grid, Badge, Heading, Box, Icon, Paragraph, IconButton, Space,Tooltip, Text, MessageBar, MenuGroup, MenuList, MenuItem, Card, CardContent, CardMedia, IconNames } from '@looker/components'
import { useParams } from "react-router-dom";
import { DateFormat } from '@looker/components/lib/DateFormat'
import ReactPlayer from "react-player"
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import LookerTile from './LookerTile'
import { database } from "firebase";

export default function DemoDetail(props:any){
    let { demoId } = useParams();
    const [name, setName] = useState<string | undefined>(undefined);
    const [dev_instance, setDevInstance] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [createdDate, setDate] = useState<any | undefined>(undefined);
    const [vertical, setVertical] = useState<string | undefined>(undefined);
    const [horizontal, setHorizontal] = useState<string | undefined>(undefined);
    const [tags, setTags] = useState<any[] | undefined>(undefined);
    const [verified, setVerified] = useState(false);
    const [overviewTitle, setOverviewTitle] = useState<string | undefined>(undefined);
    const [countViews, setViews] = useState<number | undefined>(undefined);
    const [countFavorites, setFavorites] = useState<number | undefined>(undefined);
    const [lookerContent,setLookerContent]= useState<any[] | undefined>(undefined);
    const [isFavorite,setFavorite]= useState(false);
    const [featuredVideo,setVideo]= useState<string | undefined>(undefined);
    const [links, setLinks] = useState< {[key: string]: any[]} | undefined>(undefined);

    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    // the content favorite id for the overview dashboard if its favorited
    const [favoriteContentId, setfavoriteContentId] = useState<number | undefined>(undefined)
    // the content metadata id for the overview dashboard 
    const [contentMetaId, setContentMetaId] = useState<number | undefined>(undefined)
     
    // retrieve the document from firestore 
    useEffect(() => {
        const getDemo = async (collectionRef: any) => {
            try{
                const doc = await collectionRef.doc(demoId).get();
                var linkList: {[key: string]: any[]} = {} ;
                if(doc.exists){
                    const data = doc.data()
                    data["id"]=doc.id;
                    setName(data.name);
                    setDescription(data.description);
                    setDate(data.created_at.seconds);
                    setHorizontal(data.horizontal);
                    setVertical(data.vertical);
                    setTags(data.tags);
                    setVerified(data.verified == 'True');
                    var type_lookml ='LookML';
                    var lookml_data : any[] = []; 
                    if(data.verified == 'True' && data.lookml_project_id){
                        lookml_data.push({
                            'link':'/projects/'+data.lookml_project_id,
                            'type':type_lookml,
                            'name':'LookML Prod Project',
                            'description':'View the production LookML for this demo',
                            'id':'project'
                        });
                    }
                    if(data.dev_instance && data.lookml_project_id){
                        setDevInstance(data.dev_instance);
                        lookml_data.push({
                            'url':data.dev_instance+'/projects/'+ data.lookml_project_id,
                            'type':type_lookml,
                            'name':'LookML Dev Project',
                            'restricted_access':true,
                            'description':'Open up a pull request for LookML changes'
                        });
                    }
                    if(data.git_repo){
                        lookml_data.push({
                            'link':data.git_repo,
                            'type':type_lookml,
                            'name':'Git Repo',
                            'restricted_access':true,
                            'description':'View repo in GitHub',
                            'id':'git'
                        });    
                    }
                    var type_helpful ='Helpful Links';
                    var helpful_data : any[] = []; 
                    helpful_data.push({
                        'link':'my_link',
                        'type':type_helpful,
                        'name':'Add Content',
                        'description':'Add additional content to this demo',
                        'id':'content'
                    })
                    if(data.trial_looker){
                        helpful_data.push({
                            'link':'my_form_filledin',
                            'type':type_helpful,
                            'name':'Add Users to Trial.looker',
                            'description':'Give prospects access to this demo on trial.looker.com',
                            'id':'trial'
                        })
                    }
                    if(data.dataset){
                        helpful_data.push({
                            'link':'my_form_filledin',
                            'type':type_helpful,
                            'name':'Port Over Demo',
                            'description':'Use this demo or dataset on another instance',
                            'id':'workshop'
                        })
                    }
                    if(linkList){
                        if(helpful_data.length>0){
                            linkList[type_helpful] = helpful_data;
                        }
                        if(lookml_data.length>0){
                            linkList[type_lookml] = lookml_data;
                        }
                    }
                    try{
                        const lookerQuery = await collectionRef.doc(demoId).collection("looker").orderBy("index").get();
                        var lookerList:any[] = [];
                        if(lookerQuery){
                            lookerQuery.forEach((doc: any) => {
                                const data = doc.data()
                                data["id"]=doc.id;
                                lookerList.push(data);
                            })
                            setLookerContent(lookerList);
                        }
                    }catch(err){
                        console.log('Problem getting looker content ', err)
                    }
                    try{
                        const linksQuery = await collectionRef.doc(demoId).collection("links").orderBy("type").get();
                        if(linksQuery){
                            linksQuery.forEach((doc: any) => {
                                const data = doc.data()
                                data["id"]=doc.id;
                                if(data.type =='video' && !featuredVideo){setVideo(data.link)}
                                if(data.type){
                                    var type: string = data.type;
                                    // if the data type is already a key in the object than add to the list
                                    if(linkList && Object.keys(linkList).indexOf(type)>-1){
                                        linkList[type].push(data);
                                    }
                                    else{
                                        linkList[type] = [data];
                                    }
                                }
                            })
                            setLinks(linkList);
                        }
                    }catch(err){
                        console.log('Problem getting looker content ', err)
                    }

                }
                else{
                    console.log('Document doesnt exist')
                }
            }catch(err){
                console.log('Problem retrieving document: ',err)
            }
        }
        getDemo(props.firestore.collection('use_case'));
    },[props.firestore, demoId])

    // function to favorite a dashboard
    const favoriteDashboard = () => {
        if(contentMetaId){
            const favorite = async () => {
                try{
                    const response = await sdk.ok(sdk.create_content_favorite({'content_metadata_id':contentMetaId}));
                    setFavorite(true);
                }catch(err){
                    console.log('Problem Favoriting Dashboard ', err)
                }
            }
            favorite();
        }
        else{
            console.log('Cannot delete favorite - favorite ID has not been set')
        }
    };
    
    // // function to unfavorite a dashboard
    const unfavoriteDashboard = () => {
        if(favoriteContentId){
            const unFavorite = async () => {
                try{
                    const response = await sdk.ok(sdk.delete_content_favorite(favoriteContentId));
                    setFavorite(false);
                }catch(err){
                    console.log('Problem Favoriting Dashboard ', err)
                }
            }
            unFavorite();
        }
        else{
            console.log('Cannot delete favorite - favorite ID has not been set')
        }
    }
    
    // is true if the function should make the demo a favorite, false if it should unfavorite the demo
    const handleFavorite = (shouldFav: boolean) => {
        if(shouldFav){
            // favorite the overview dashboard
            favoriteDashboard();
        }
        else{
            // unfavorite the overview dashboard
            unfavoriteDashboard();
        }
    }

    
    return(
        <Box padding="2rem" display="flex" paddingBottom="3rem">
            <Box width="70%" marginRight="1rem">
                <Box display="flex" position="relative">
                    <Heading color="key" fontSize="xlarge" fontWeight="bold">{name}</Heading>
                    { isFavorite ? 
                        <Tooltip content={"Unfavorite All Demos with " + overviewTitle + " Dashboard"} width="10rem">
                            <IconButton label="Unfavorite" icon="Favorite" onClick={()=>handleFavorite(false)}/>
                        </Tooltip> 
                        : 
                        <>
                            { verified ? 
                                <Tooltip content={"Favorite All Demos with "+ overviewTitle + " Dashboard"} width="10rem">
                                    <IconButton label="Favorite" icon="FavoriteOutline" onClick={()=>handleFavorite(true)} />
                                </Tooltip> 
                                :
                                <Tooltip content={"Can't Favorite Unverified Demos"+ overviewTitle + " Dashboard"} width="10rem">
                                    <IconButton label="Cant Favorite" icon="FavoriteOutline" disabled /> 
                                </Tooltip> 
                            }
                        </>
                    }
                    <Box right="0" top="0" position="absolute" display="flex">
                        {createdDate && new Date().getSeconds() - createdDate< 14*60*60*24 ? 
                                <Box marginRight="3">
                                    <Badge intent="inform">
                                        New Use Case!
                                    </Badge>
                                </Box>
                            : <></>
                        }
                        {verified ? <Badge intent="positive">Verified by Demo Team</Badge> : 
                                    <Badge intent="warn">Unverified by Demo Team</Badge>}
                    </Box> 
                </Box>
                    <Box marginTop=".25rem" display="flex">
                    {verified ?     
                        <Box marginRight="7">
                            <Text fontSize='xxsmall' variant="secondary" marginRight="2">{countViews} Views, </Text>
                            <Text fontSize='xxsmall' variant="secondary">{countFavorites} Favorites </Text>
                        </Box>
                        :  <></>
                    }
                    <Box ><Text fontSize='xxsmall' variant="secondary">Created on <DateFormat>{new Date()}</DateFormat></Text></Box>
                    </Box>
                    <Heading marginTop=".25em" fontSize="small">{description}</Heading>
                    <Box marginTop="1.5rem">
                        <Box display="flex" marginLeft="-4">
                            <Badge intent="neutral">Vertical: {vertical}</Badge>
                            <Box marginLeft="3"><Badge intent="neutral">Horizontal: {horizontal}</Badge></Box>
                            {tags?.map((tag) => <><Box marginLeft="3"><Badge intent="neutral">{tag}</Badge></Box></>)}
                        </Box>
                    </Box>
                    <Box marginTop="2rem">
                        <Grid columns={4}>
                        {lookerContent?.map((d) => <LookerTile key={d.id} {...d} verified={verified} dev_instance={dev_instance} setfavoriteContentId={setfavoriteContentId} setContentMetaId={setContentMetaId} setOverviewTitle={setOverviewTitle} setViews={setViews} setFavorites={setFavorites} setFavorite={setFavorite} isFavorite={isFavorite}/>)}
                        </Grid>
                        {featuredVideo ? <Box marginTop="2rem" width="100%" >
                            <ReactPlayer
                                width="100%"
                                url={featuredVideo}
                            />
                        </Box> : <></>}
                    </Box>
                </Box>
            <Box marginLeft="3rem" width="30%">
                <MenuList>
                    {links ? Object.keys(links).map((type:string) => <LinkGroup key={type} type={type} links={links[type]}/>) : <></>}
                </MenuList>
            </Box>
    </Box>
    )
}


export function LinkGroup(props:any){
    const [iconName,setIcon] = useState<IconNames>("Link");
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const extensionHost = extensionContext.extensionSDK
    const [isNew, setNew] = useState(false);

    console.log(props)

    useEffect(()=>{
        if(props.created_at){
            const today = new Date().getTime();
            if(today - 14*60*60*24 < props.created_at.seconds ){
                setNew(true)
            }

        }
    },[props.created_at])
    

    useEffect(()=>{
        if(props.type === 'drive'){
            setIcon("IdeFileDocument")
        }
        else if(props.type === 'looker'){
            setIcon("LogoRings")
        }
        else if(props.type === 'video'){
            setIcon("DoubleChevronRight")
        }
        else if(props.type === 'LookML'){
            setIcon("Code")
        }
    },[props.type])


    return(
        <MenuGroup label={props.type.charAt(0).toUpperCase() + props.type.slice(1)}>
            {props.links.map((l:any)=> <MenuItem 
            key={l.id}
            onClick={() => extensionHost.openBrowserWindow(l.link, '_blank')}
             icon={iconName} description={l.description}>
                 {l.name}
                 <Box display="flex" position="absolute" right="0" top="15%">
                    {l.restricted_access ? <Badge size="small" intent="warn">Restricted</Badge> : <></>}
                    {l.shareable ? <Badge size="small" intent="positive">Shareable</Badge> : <></>}
                    {isNew ? <Badge size="small" intent="inform">New!</Badge> : <></>}
                </Box>
            </MenuItem>)}
        </MenuGroup>
    )
}
