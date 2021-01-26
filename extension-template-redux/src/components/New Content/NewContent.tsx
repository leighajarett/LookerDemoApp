import { Heading, Box, Tabs, TabList, TabPanel, TabPanels, Tab } from '@looker/components'
import React, { useState, useEffect } from "react"
import styled from 'styled-components'
import { Link as RouterLink, Route, Switch, useLocation } from 'react-router-dom'
import { ROUTES } from "../Extension/Extension"
import NewNew from './NewNew'
import LogNew from './LogNew'
import AddNew from './AddNew'
import {useHistory} from 'react-router-dom';




export default function NewContent(props:any){
    const [currentTabIndex, setTab] = useState(0)
    const tabIndex: { [k: number]: string } ={0:ROUTES.NEW_NEW_ROUTE as string, 1:ROUTES.ADD_NEW_ROUTE as string, 2:ROUTES.LOG_NEW_ROUTE as string}
    // reverse the index json for easier lookup
    const revTabIndex: { [k: string]: number }  = {};
    Object.keys(tabIndex).forEach((key => {
        var nKey = parseInt(key);
        revTabIndex[tabIndex[nKey]] = nKey;
    }));

    const location = useLocation();
    const history = useHistory();
    
    // set initial state
    useEffect(()=>{
        if(location.pathname == '/new'){
            setTabRoute(0);
        }
        else{
            setTab(revTabIndex[location.pathname]);
        }
    },[])


    const setTabRoute = (t:number) => {
        history.push(tabIndex[t]);
        setTab(t);
    }
    ;

    // adding any docs will move to a shared folder
    return(
        <Box marginTop="2rem" marginLeft="2rem" marginRight="2rem" >
            <Box width="40%" marginBottom=".3rem">
                <Heading color="key" fontSize="xlarge" fontWeight="bold">Create New Content</Heading>
                {/* <Heading marginTop="1em" fontSize="small">So you're looking to build some new demo assets - great! </Heading> */}
            </Box>
            <Tabs index={currentTabIndex} onChange={setTabRoute}>
                <TabList>
                    <Tab>Create a New Demo</Tab>
                    <Tab>Modify an Existing Demo</Tab>
                    <Tab>Log Demo Content</Tab>
                </TabList>
                <TabPanels>
                    <Switch>
                        <Route path={ROUTES.NEW_NEW_ROUTE} exact>
                            <NewNew/>
                        </Route>
                        <Route path={ROUTES.ADD_NEW_ROUTE} exact >
                            <AddNew/>
                        </Route>
                        <Route path={ROUTES.LOG_NEW_ROUTE} exact>
                            <LogNew firestore={props.firestore}/>
                        </Route>
                    </Switch>
                </TabPanels>
            </Tabs>
        </Box>
    )
    }



    export const FullWidthTabList = styled(TabList as any)`
        width: 100%
    `