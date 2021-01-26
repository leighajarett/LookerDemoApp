import { Heading, Box, FieldCheckbox, Space, Fieldset, List, ListItem, Paragraph, FieldSelectMulti, Grid, Link } from '@looker/components'
import React, { useState, useEffect, useContext } from "react"
import DemoTile from './DemoTile'
import {
    ExtensionContext,
    ExtensionContextData,
  } from '@looker/extension-sdk-react'
import { useLocation, useHistory } from 'react-router-dom';

export default function DemoContent(props:any){
    let query = new URLSearchParams(useLocation().search);
    const history = useHistory();
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
    const { extensionSDK, core40SDK } = extensionContext;
    const [verticalOptions, setVerticalOptions] = useState<any[]>([]);
    const [horizontalOptions, setHorizontalOptions] = useState<any[]>([]);
    const [tagOptions, setTagOptions] = useState<any[]>([]);
    const [verticals, setVerticals] = useState<string[] | undefined>([])
    const [horizontals, setHorizontals] = useState<string[] | undefined>([])
    const [tags, setTags] = useState<string[] | undefined>([])
    const [instances, setInstances] = useState<string[] | undefined>([])
    const [demos, setDemos] = useState<any[]>([]);
    const [displayedDemos, setDisplayedDemos] = useState<any[]>([]);


    // Get all the possible options for filters
    useEffect(()=>{
        // query firestore to get all unique verticals
        const getDemos = async (collectionRef: any) => {
            try{
                // get all the documents
                const querySnapshot = await collectionRef.orderBy("new_banner.last_updated_at", "desc").get();
                var allDemos:any[] = [];
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
                        console.log(data)
                        allDemos.push(data);
                        // add the verticals 
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
                    setDemos(allDemos);
                    setDisplayedDemos(allDemos);
                    setVerticalOptions(allVerticalOptions);
                    setHorizontalOptions(allHorizontalOptions);
                    setTagOptions(allTagOptions);
                }
            }catch(err){
                console.log('Problem getting demos: ',err)
            }
        }
        getDemos(props.firestore.collection('use_case'));
        // set initial state based on the query results
        setVerticals(JSON.stringify(query.get("verticals")?.split(','))==JSON.stringify([""]) ? [] : query.get("verticals")?.split(','));
        setHorizontals(JSON.stringify(query.get("horizontals")?.split(','))==JSON.stringify([""]) ? [] : query.get("horizontals")?.split(','));
        setTags(JSON.stringify(query.get("tags")?.split(','))==JSON.stringify([""]) ? [] : query.get("tags")?.split(','));
        setInstances(JSON.stringify(query.get("instances")?.split(','))==JSON.stringify([""])? [] : query.get("instances")?.split(','));
    }
    ,[])

    // handle filter change by pushing into path
    const handleFilterChange = () => {
        let searchParams = new URLSearchParams()
        searchParams.set('verticals', verticals?.join(',') || '')
        searchParams.set('horizontals', horizontals?.join(',') || '')
        searchParams.set('tags', tags?.join(',') || '')
        searchParams.set('instances', instances?.join(',') || '')
        history.push({search: "?" + searchParams.toString()})
    }


    useEffect(()=>{
        handleFilterChange()
        // filter the demos
        let filteredDemos = demos.filter((d)=>{
            var v = true;
            var t =true;
            var h = true;
            var i = true;
            if(verticals && verticals.length > 0){
                v = verticals?.indexOf(d.vertical)>-1
            }
            if(horizontals && horizontals.length > 0){
                h = horizontals?.indexOf(d.horizontal)>-1
            }
            if(tags && tags.length > 0){
                t = d.tags.some((r:any)=> tags.indexOf(r) >= 0)
            }
            return v &&  h && t && i
        })
        setDisplayedDemos(filteredDemos);
        console.log('my filtered results ', displayedDemos.slice(), filteredDemos)
    }
    ,[verticals,tags,horizontals, instances, demos])

    return(
        <Box width="100%" paddingTop="2em" padding="2em">
            <Box display="flex" >
                <Box width="50%" marginRight="1rem">
                    <Heading color="key" fontSize="xlarge" fontWeight="bold">Available Demo Content</Heading>
                    <Heading marginTop="1em" fontSize="small">Use the filters to browse for the demo content you need. 
                    Click into any demo tile to see details and links to associated content, or head over to our <Link onClick={() => extensionSDK.openBrowserWindow('https://drive.google.com/corp/drive/u/0/folders/1C-vepuUT4Dc1t9wPD0mFcDsoeAHJEaWW', '_blank')}>Google Drive folder</Link> to browse files.</Heading>
                </Box>
                    <Fieldset legend="Filters" accordion defaultOpen>
                        <Grid columns={4}>
                            <FieldSelectMulti 
                                label="Vertical"
                                options={verticalOptions}
                                values={verticals}
                                onChange={setVerticals}
                                isFilterable
                                removeOnBackspace
                            />
                            <FieldSelectMulti 
                                label="Horizontals"
                                options={horizontalOptions}
                                values={horizontals}
                                onChange={setHorizontals}
                                isFilterable
                                removeOnBackspace
                            />
                            <FieldSelectMulti 
                                label="Tags"
                                options={tagOptions}
                                values={tags}
                                onChange={setTags}
                                isFilterable
                                removeOnBackspace
                            />
                            <FieldSelectMulti 
                                label="Production Instances"
                                options={[{'value':'Trial'},{'value':'PartnerDemo'},{'value':'GoogleDemo'}]}
                                values={instances}
                                onChange={setInstances}
                                isFilterable
                                removeOnBackspace
                            />
                        </Grid>
                    </Fieldset>
            </Box>
            <Grid marginTop="1rem" columns={4}>
                {displayedDemos.map((demo, index)=> <DemoTile key={index} {...demo}/>)}
            </Grid>
        </Box>
    )
}

