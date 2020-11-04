import React, { useState, useContext, useEffect } from "react"
import { Popover, Button, IconButton, PopoverContent, Paragraph, Box, Heading} from '@looker/components'
import { useParams } from "react-router-dom";
import { DateFormat } from '@looker/components/lib/DateFormat'
import ReactPlayer from "react-player"
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import Messages from "./Messages";
import styled from 'styled-components';

// const styledPopoverContent = styled(PopoverContent)`
//     padding: 0;
//   `;

export default function LookerBot(props:any){

    const popoverContent = (
        <Box width="25rem" height="35rem" overflow="hidden">
            <Messages/>
       </Box>
      )
    
    return(
        <Box position="fixed" right="1em" bottom="1em" >
            <Popover content={popoverContent} placement="top-start">
                <IconButton size="large" label="Chatbot" icon="Chat"></IconButton>
            </Popover>
        </Box>
    )
}



