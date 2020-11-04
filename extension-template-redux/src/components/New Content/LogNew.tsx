import { Grid, ListItem, List, Badge, Link, Heading, Box, Tabs, TabList, TabPanel, TabPanels, Tab, Paragraph, Accordion,  AccordionDisclosure, AccordionContent, Form, FieldText, Button, SpaceVertical } from '@looker/components'
import React, { useContext } from "react"
import Logger from './Logger'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { ROUTES } from '../Extension/Extension'
import {
    ExtensionContext,
    ExtensionContextData,
  } from '@looker/extension-sdk-react'

export default function LogNew(){
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
    const { extensionSDK, core40SDK } = extensionContext;

    // const history = useHistory();
    return(
        <Box>
            <Heading fontSize="medium">
                If you're here, you must have created some awesome demo stuff that you want to be available to the broader team. Hooray!  
            </Heading>
            <Box marginTop="1rem">
            <SpaceVertical>
            <Accordion indicatorSize="large">
                <AccordionDisclosure >
                <Heading fontWeight="bold" fontSize="medium">1) Review demo considerations </Heading>
                <Paragraph fontSize="small" fontWeight="normal">Review the considerations below before requesting content to be added to our system </Paragraph>
                </AccordionDisclosure>
                <AccordionContent>
                    <Grid columns={2}>
                        <Box backgroundColor="ul2" fontSize="small">
                            <List type="bullet">
                            <ListItem>
                            You can use the form below to log the demo content you've created into our backend, so it's available for everyone in the 
                                <Link onClick={()=>extensionSDK.openBrowserWindow(ROUTES.CONTENT_ROUTE, '_blank')}> demo content tab</Link></ListItem>
                            <ListItem>Any google drive docs that you add here will be migrated to a shared folder, if you want to keep it where it is please make a copy and add that link</ListItem>
                            <ListItem>You can mark content as shareable, which means that users can share it with their prospective customers</ListItem>
                            <ListItem>
                                    Your demo should include a demo script, a recorded screenshare and day in the life slides to make it impactful to the team
                            </ListItem>
                            <ListItem>
                                    You should not use any sensitive data in your demos, please use fake data or publicly available datasets
                            </ListItem>
                            </List>
                        </Box>
                        <Box backgroundColor="ul2" fontSize="small">
                            <List type="bullet">
                            <ListItem>You can also chose to have your content reviewed by the Looker demo team so that it is added to our production 
                                <Link onClick={()=>extensionSDK.openBrowserWindow(ROUTES.INSTANCE_ROUTE, '_blank')}> demo instances. </Link> 
                                To get your demo approved, it must meet the following requirements:</ListItem>
                            <List type="bullet">
                                <ListItem>
                                    Your demo data should be available in the lookerdata or looker-private-demo BQ projects, you can 
                                    <Link onClick={()=>extensionSDK.openBrowserWindow(ROUTES.INSTANCE_ROUTE, '_blank')}> submit a request</Link> to add data if it's in a different project
                                </ListItem>
                                <ListItem>
                                    Your demo should include at least two dashboards, complete with drilling, linking and data actions; LookML should be clearly commented and your explores should have labels and descriptions
                                </ListItem>
                                <ListItem>
                                    Your LookML project must be configured with a Github Repository, and you need to add @leigha_jarett as an admin on your repo. You must also require pull requests inside your projects settings.
                                </ListItem>
                            </List>
                            </List>
                        </Box>
                    </Grid>
                </AccordionContent>
            </Accordion>
            <Accordion indicatorSize="large">
                <AccordionDisclosure >
                <Heading fontWeight="bold" fontSize="medium">2) Tell us about your demo </Heading>
                <Paragraph fontSize="small" fontWeight="normal">Use this form to add new demos to our database, or log new content to existing demos</Paragraph>
                </AccordionDisclosure>
                <AccordionContent>
                    <Logger/>
                </AccordionContent>
            </Accordion>
            <Accordion indicatorSize="large">
                <AccordionDisclosure >
                <Heading fontWeight="bold" fontSize="medium">3) Wait to hear from us </Heading>
                <Paragraph fontSize="small" fontWeight="normal">We will review your request and reply with any questions</Paragraph>
                </AccordionDisclosure>
                <AccordionContent>
                    If you requested your demo to be 
                </AccordionContent>
            </Accordion>
            </SpaceVertical>
            </Box>
        </Box>
    )
}
