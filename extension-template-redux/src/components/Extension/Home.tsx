import { Heading, Box, TabList, Tab, TabPanels, TabPanel, Button, Paragraph, Grid, Link, Icon, Space, Tooltip, Flex, Spinner } from '@looker/components'
import React, { useState, useEffect, useContext } from "react"
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
    // POSTS_SERVER,
    GOOGLE_CLIENT_ID,
    GOOGLE_SCOPES
  } from '../..';
  import {
    ExtensionContext,
    ExtensionContextData,
  } from '@looker/extension-sdk-react'
import { strLookerClientId } from '@looker/sdk/lib/rtl/apiSettings';
import { ListIterateeCustom, isArguments } from 'lodash';
import DemoTile from '../Demo Content/DemoTile';
import LookerBot from '../LookerBot/LookerBot';


interface HomeProps {
    firestore: any
}    

export default function Home(props: HomeProps){
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
    const { extensionSDK, core40SDK } = extensionContext;
    const sdk = extensionContext.core40SDK
    const [favoriteDemos, setFavorites] = useState<any[]>([]);
    // for telling the homepage if its should still show the loading bar - since a user may just not have any favorites
    const [checkedFavorites, setCheckedFavorites] = useState(false);
    const [newDemos, setNew] = useState<any[]>([]);
    // const [favoritesLoading, setFavoritesLoading] = useState(false);

    // get the 6 most recently updated demo use case documents
    useEffect(() => {
        const getNewDemos = async (collectionRef: any) => {
            try{
                // where("new_banner.last_updated_at.seconds",">=",new Date().getTime()/1000 + 24*60*60*14)
                const querySnapshot = await collectionRef.orderBy("new_banner.last_updated_at", "desc").limit(6).get();
                var newList:any[] = [];
                if(querySnapshot){
                    querySnapshot.forEach((doc: any) => {
                        const data = doc.data()
                        data["id"]=doc.id;
                        newList.push(data);
                    })
                    setNew(newList);
                }
            }catch(err){
                console.log('Problem getting new demos: ',err)
            }
        }
        getNewDemos(props.firestore.collection('use_case'));
    },[props.firestore])


    // when the home component loads, get the user's favorite dashboards and then use that to find their favorite demos
    useEffect(() => { 
        const getAllFavorites = async (collectionRef:any) => {
            try {
                const me = await sdk.ok(sdk.me());
                // get all the favorites for my user
                if(me.id){
                    const favs = await sdk.ok(
                        sdk.search_content_favorites({user_id: me.id.toString()})
                    )  
                    // just get all the dashboard slugs
                    var favDashboards:string[] = [];
                    await Promise.all(favs.map(async(contentFav)=>{
                        if(contentFav.dashboard_id){
                            const dashSlug = await sdk.ok(sdk.dashboard(contentFav.dashboard_id.toString()));
                            if(dashSlug.slug){favDashboards.push(dashSlug.slug);}
                        }
                    }));
                    if(favDashboards.length>0){
                        try{
                            const querySnapshot = await collectionRef.where('overview_dashboard_slug', 'in', favDashboards).get();
                            var favList:any[] = [];
                            if(querySnapshot){
                                querySnapshot.forEach((doc: any) => {
                                    const data = doc.data();
                                    favList.push(data);
                                })
                                setFavorites(favList);
                            }
                        }catch(err){
                            console.log('Problem getting favorite demos: ',err)
                        }
                    }
                    else{
                        console.log('User has no favorites')
                    }
                    setCheckedFavorites(true);
                }  
            } catch (error) {
                console.log('Problem getting favorites from Looker: ', error)
            }
        };
        getAllFavorites(props.firestore.collection('use_case'))
    } ,[props.firestore])

    return(
        <Box padding="2em">
            <Box width="70%">
                <Heading color="key" fontSize="xlarge" fontWeight="bold">Welcome to the Google Cloud Looker demo instance!</Heading>
                <Heading marginTop="1em" fontSize="small">This instance was built to give the Google Cloud Sales team a centralized enviornment 
                to give Looker product demonstrations to prospective customers. In order to keep everything working as
                 planned, you will have limited permissions on this instance. This homepage is a custom application 
                 built by the Looker demo team, using the <Link onClick={() => extensionSDK.openBrowserWindow('https://docs.looker.com/data-modeling/extension-framework/extension-framework-intro', '_blank')}>extension framework</Link>
                 , to help you get everything you need to give effective demonstrations.</Heading>
            </Box>
            {newDemos.length > 0 && checkedFavorites ?
            <Box display="flex" flexDirection="column">
                <Box marginTop="2em">
                    <Box display="flex"><Space>
                        <Heading fontSize="large" fontWeight="bold">What's New</Heading>
                        <Tooltip content="The most recently created demo content"><Icon name="RecentActivity"/></Tooltip >
                    </Space></Box>
                    <Grid columns={4}>
                        {newDemos.map((demo, index)=> <DemoTile favoriteDemos={favoriteDemos} setFavorites={setFavorites} key={index} {...demo}/>)}
                    </Grid>
                </Box>
                <Box marginTop="2em" >
                    <Box display="flex"><Space>
                        <Heading fontSize="large" fontWeight="bold">Your Favorites</Heading>
                        <Tooltip content="Demos where you have favorited the initial overview dashboard"><Icon name="Favorite"/></Tooltip >
                    </Space></Box>
                    <Grid columns={4}>
                        {favoriteDemos.map((demo, index)=> <DemoTile favoriteDemos={favoriteDemos} setFavorites={setFavorites}  key={index} {...demo}/>)}
                    </Grid>
                </Box>
            </Box>
            :
            <Flex width='100%' height='90%' alignItems='center' justifyContent='center'>
                <Spinner color='black' size={80}/>
            </Flex>
            }
        </Box>
    )
}

            {/* <Grid marginTop="2em" columns={3} padding="2em">
                <Box>
                    <Heading fontSize="medium" fontWeight="bold">Learn About Looker</Heading>
                    <Paragraph fontSize="small">You can learn more about how to use Looker at go/learnlooker and explore these training resources to understand how to sell Looker and give an effective demo</Paragraph>
                </Box>
                <Box>
                    <Heading fontSize="medium" fontWeight="bold">Explore Existing Demo Content</Heading>
                    <Paragraph  fontSize="small">Explore existing demo content including links to pre-built dashboards, bigquery datasets, videos recordings, demo talk tracks and slide decks here</Paragraph>
                </Box>
                <Box>
                    <Heading fontSize="medium" fontWeight="bold">Know Your Permissions </Heading>
                    <Paragraph  fontSize="small">You will not have the ability to create new projects, push LookML to production, modify shared dashboards, save content to shared spaces or access the admin panel on this instance</Paragraph>
                </Box>
            </Grid> */}