import { ListItem, List, Header, Accordion, AccordionDisclosure, AccordionContent,Heading, Box, Grid, Card, CardMedia, CardContent, Text, Paragraph } from '@looker/components'
import React, { useEffect, useState, useContext } from "react"

import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { ValueSettings } from '@looker/sdk/lib/rtl/apiSettings';
import { stringComparator } from '@looker/components/lib/ActionList/utils/sort_utils';
import { Link } from 'react-router-dom';

const EXPLORE_CONTENT_LINK = "/extensions/demo_mangement::homepage_extenstion/content?verticals=&horizontals=&tags=&instances=Trial"
const USER_FORM = "https://docs.google.com/forms/d/e/1FAIpQLScIUXOI07pDKLCAd0jcGAtfi5lZb7DczzluM6V8r_NOkCD9fw/viewform"
const DATA_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSe_gIuNOUvGxrqgaWNZ7RaqS5KvwOCGAd9zSM6s61bSn8DV5A/viewform"
const PROSPECT_USAGE = 'https://trial.looker.com/dashboards-next/126'
const META_DASH = "https://meta.looker.com/dashboards/8365"
const DITL_TEMPLATE = "https://docs.google.com/presentation/d/1WSU7nfsPZPwcpiELchVbSOj1o13eCf2GD5SnfGNX_nY/edit#slide=id.g74a76ef22c_0_618"
const QA_TEMPLATE = "https://docs.google.com/document/d/17eU4JugVlZa-dLDesFM0v29xIkt-3Z7Fy5cGQ57TkjE/edit"



export default function Workshop(){
    const [svg, setSvg] = useState<any[]>([]);
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const extensionHost = extensionContext.extensionSDK

    // get two dashboard thumbnails to use
    useEffect(()=>{
        const getThumbnail = async () => {
            var svgs:any[] =[];
            var i=1;
            while(svgs.length<2){
                try{
                    const thumbnailResponse = await sdk.ok(sdk.content_thumbnail({type:'dashboard',resource_id: i.toString()}));
                    const blob = new Blob([thumbnailResponse], { type: 'image/svg+xml' });
                    let url = URL.createObjectURL(blob);
                    svgs.push(url);
                }
                finally{
                    i=i+1;
                }
            }
            setSvg(svgs);
        }
        getThumbnail()
        },[])
    
    
    
    return(
        <Box width="100%" paddingTop="2em" padding="2em">
            <Box marginRight="5em">
                <Heading color="key" fontSize="xlarge" fontWeight="bold">Workshop Proof of Concepts</Heading>
                <Heading marginTop="1em" fontSize="small"> Workshop proof of concepts allow you to lead a technical evlauation using our demos instead of creating a full scale PoC on prospective customer's data. 
                You can either add your prospective customers to Trial.looker.com or port demos over to your own trial instance. You can see all the available content on trial.looker.com <Link to={EXPLORE_CONTENT_LINK}>here</Link>
                </Heading>
            </Box>
            <Box marginTop="2em">
                <Heading color="key" fontSize="large" fontWeight="bold">Quick Links</Heading>
                <Grid marginTop=".5em" columns={5}>
                    <Workshop_Card id="meta" image={svg[0]} text='Meta.looker.com' heading="Workshop PoC Overview" link={META_DASH}/>    
                    <Workshop_Card id="trial_usage" image={svg[1]} text='Trial.looker.com' heading="Trial.looker Prospect Usage" link={PROSPECT_USAGE}/>
                    <Workshop_Card id="user_form" image="https://storage.googleapis.com/bq_showcase_images/users_form_preview.png" text='Google Form' heading="Add Users to Trial.looker.com" link={USER_FORM}/>
                    <Workshop_Card id="data_form" image="https://storage.googleapis.com/bq_showcase_images/importing_form_preview.png" text='Google Form' heading="Request Demo Data Access" link={DATA_FORM}/>
                </Grid>
            </Box>
            <Box marginTop="2em">
                <Heading color="key" fontSize="large" fontWeight="bold">How to Guides</Heading>
                <Grid marginTop=".5em" columns={2}>
                    <Accordion indicatorPosition="left">
                        <AccordionDisclosure fontSize="medium">Trial.looker.com</AccordionDisclosure>
                        <AccordionContent>
                            <List>
                                <Paragraph fontSize="small" fontStyle="italic">Use trial.looker.com when your prospects do not need to test admin functionality, embedding capabilities or API workflows
                                </Paragraph>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">1. Explore Available Content</Paragraph>
                                    <Paragraph fontSize="small">You can head <Link to={EXPLORE_CONTENT_LINK}>here</Link> to explore the different content available on trial.looker</Paragraph>
                                </ListItem>
                                <ListItem>
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">2. Add Users to Instance</Paragraph>
                                    <Paragraph fontSize="small">Use <Link to={USER_FORM}>this form</Link> to add new users. Prospective customers will be disabled after 2 weeks. The AE + SE will receive reminders via email a few days before the user is set to expire. You can use the same form to extend your user’s lifetime.</Paragraph>
                                </ListItem>
                                <ListItem>
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">3. Use Supporting Material</Paragraph>
                                    <Paragraph fontSize="small">Use DITL slides + Explore Q&A Packet to help your users along with their journey. If the content you need doesn’t exist already you can find the <Link to={DITL_TEMPLATE}>DITL template here</Link> and the <Link to={QA_TEMPLATE}>Q&A Packet template here</Link>. Once you’ve created new content make sure to add it to our directory by heading over to this page</Paragraph>
                                </ListItem>
                                <ListItem>
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">4. Track Prospects Usage</Paragraph>
                                    <Paragraph fontSize="small">You can track your prospects usage on trial.looker.com by scheduling <Link to={PROSPECT_USAGE}>this report</Link> to be emailed to both you and your AE (change the filter to be your prospect’s email domain)</Paragraph>
                                </ListItem>
                                <ListItem>
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">5. Give Use Feedback </Paragraph>
                                    <Paragraph fontSize="small">Two weeks after you request access you will be emailed a Google form to give feedback on the process, please fill it out in a timely manner as this will help us improve the process</Paragraph>
                                </ListItem>
                            </List>
                        </AccordionContent>
                    </Accordion>
                    <Accordion indicatorPosition="left">
                        <AccordionDisclosure fontSize="large">Client Instance</AccordionDisclosure>
                        <AccordionContent>
                            <Paragraph fontSize="small" fontStyle="italic">Use a client workshop instance if your prospects needs to test admin functionality, embedding capabilities or API workflows
                            </Paragraph>
                            <List>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">1. Explore Available Content</Paragraph>
                                    <Paragraph>You can use the Demo Content page to explore the different demo content that is available for use</Paragraph>
                                </ListItem>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">2. Spin up a New Instance through Salesforce</Paragraph>
                                    <Paragraph>The Looker account executive for the deal should spin up a new instance through salesforce like they normally would for any other trial</Paragraph>
                                </ListItem>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">3. Request Access to Datasets and Port Over Content</Paragraph>
                                    <Paragraph>Use <Link to={DATA_FORM}>this form</Link> to request access to the content, you will be emailed instructions on how to port over the content to your new instance</Paragraph>
                                </ListItem>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">4. Use Supporting Material</Paragraph>
                                    <Paragraph fontSize="small">Use DITL slides + Explore Q&A Packet to help your users along with their journey. If the content you need doesn’t exist already you can find the <Link to={DITL_TEMPLATE}>DITL template here</Link> and the <Link to={QA_TEMPLATE}>Q&A Packet template here</Link>. Once you’ve created new content make sure to add it to our directory by heading over to this page</Paragraph>
                                </ListItem>
                                <ListItem marginTop="1em">
                                    <Paragraph marginTop="1em" fontSize="small" fontWeight="bold">5. Give Use Feedback</Paragraph>
                                    <Paragraph fontSize="small">Two weeks after you request access using the form above you will be emailed a Google form to give feedback on the process, please fill it out in a timely manner as this will help us improve the process</Paragraph>
                                </ListItem>
                            </List>
                        </AccordionContent>
                    </Accordion>
                </Grid>
            </Box>
        </Box>
    )}

    export  function Workshop_Card(props:any){
        const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
        const sdk = extensionContext.core40SDK
        const extensionHost = extensionContext.extensionSDK
        console.log(props.image)

    return(
        <Card marginRight="1rem" width="15rem" height="13rem" onClick={() => extensionHost.openBrowserWindow(props.link,'_blank')}raised>
            <CardMedia image={props.image}/>
            <CardContent>
                <Text
                    fontSize="xxsmall"
                    textTransform="uppercase"
                    fontWeight="semiBold"
                    variant="subdued"
                >{props.text}</Text>
                <Heading as="h4" fontSize="small" fontWeight="semiBold" truncate>{props.heading}</Heading>
            </CardContent>
        </Card>   
    )}


