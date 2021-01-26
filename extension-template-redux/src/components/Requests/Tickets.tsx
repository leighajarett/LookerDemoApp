import { Heading, Box, ButtonOutline, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableDataCell, IconButton, Paragraph} from '@looker/components'
import React from "react"
import { Link } from 'react-router-dom'


export default function Tickets(){
    const BUGANIZER_RECENT_LINK = "https://buganizer.corp.google.com/issues?q=status:open%20componentid:868129"
    const ROADMAP_LINK = "https://buganizer.corp.google.com/issues?q=status:open%20componentid:868129"
    const BUGANIZER_LINK = 'https://b.corp.google.com/u/0/issues/new?component=941828'
    const templates = {'looker_bug':'1493739','content_error':'1493739','performance':'1493739', }
    // &template=1493739
    return(
        <Box marginTop="2rem" marginLeft="2rem" marginRight="2rem" >
            <Box width="80%" marginBottom=".3rem">
                <Heading color="key" fontSize="xlarge" fontWeight="bold">Submit a Request</Heading>
                <Heading marginTop="1em" fontSize="small">You can use the links below to submit issues in Buganizer with the Looker Demo Team. Please limit issues to those occuring on our demo instances.
                </Heading>
                <ButtonOutline marginTop="1em" marginRight="1em" onClick={() => BUGANIZER_RECENT_LINK}>See Issues in Buganizer</ButtonOutline>
                <ButtonOutline marginTop="1em" onClick={() => BUGANIZER_RECENT_LINK}>View Team Roadmap</ButtonOutline>
                <Table marginTop="2em">
                    <TableHead>
                        <TableRow>
                        <TableHeaderCell fontSize="xlarge">Bugs</TableHeaderCell>
                        <TableHeaderCell fontSize="xlarge">Requests</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <Cell title="Looker Bug on Demo Instance" description="Flag a product bug thats happening on a Looker instance, for example a page not rendering"/>
                            <Cell title="Request Access / License Change" description="Request access to certain resources, or request features to be turned on for a demo instace"/>
                        </TableRow>
                        <TableRow>
                            <Cell title="Error in Demo Content" description="SQL / LookML error on dashboards, looks, or explores for verified demo content (check demo content page if unsure)"/>
                            <Cell title="Demo Feature Request" description="Request a small change or addition to an existing demo"/>
                        </TableRow>
                        <TableRow>
                            <Cell title="Flagging Poor Performance" description="Dashboards or explore queries are taking a long time to load"/>
                            <Cell title="Submit New Demo Request" description="Request for demo team to own or help with Looker demo content, or just a general request"/>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
       </Box>
    )}

export function Cell(props:any){
    return(
        <TableDataCell width="600" margin="1em">
            <Box display="flex">
                <ButtonOutline marginRight=".5rem"><img width="20" height="20" src="https://www.gstatic.com/buganizer/img/v0/logo.svg"/></ButtonOutline>
                <Box>
                    {props.title}
                    <Paragraph fontSize="xsmall">{props.description}</Paragraph>
                </Box>
            </Box>
        </TableDataCell>
    )
}


