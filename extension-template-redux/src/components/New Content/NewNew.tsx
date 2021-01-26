import { List, Heading, Box, Tabs, TabList, TabPanel, TabPanels, Tab, Paragraph, ListItem } from '@looker/components'
import React from "react"


export default function NewNew(){
    // link to some templates
    return(
        <>
            <Paragraph>Use the flow chart below to figure out what instance you should be developing in</Paragraph>
            <Box margin="2em" height="70%" width="70%">
                <img height="100%" width="100%" src="https://storage.googleapis.com/bq_showcase_images/new_demo.png"></img>
            </Box>
            <List type="bullet">
                <ListItem>
                    Googlecloud.looker.com - share the dataset with this service account googlecloud-looker@lookerdata.iam.gserviceaccount.com (BQ Viewer Role + Project Viewer Role) and use the connection lookerdata,  log information in the tracking sheet here
                </ListItem>
                <ListItem>
                    demoexpo.looker.com - share the dataset with this service account democorp@lookerdata.iam.gserviceaccount.com (BQ Viewer Role + Project Viewer role)  and use the connection lookerdata, log information in the tracking sheet here
                </ListItem>
                <ListItem>
                    Request a temporary instance here,  demo data request form here
                </ListItem>
            </List>
        </>
    )
    }
