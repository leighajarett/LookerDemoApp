import React, { useState, useContext, useEffect, useRef } from "react"
import ReactDOM from 'react-dom';
import { Form, InputText, Grid, Popover, Button, IconButton, PopoverContent, Paragraph, Box, List, ListItem, Badge } from '@looker/components'
import { useParams } from "react-router-dom";
import { DateFormat } from '@looker/components/lib/DateFormat'
import ReactPlayer from "react-player"
import styled from 'styled-components'
import { ObjectIterator, ObjectIterateeCustom } from "lodash";
import {connect} from 'react-redux'
import { addMessages, onChange, updateSession, receiveMessage } from "../../data/actions";
import { message } from "../../data/reducers";
import { variant, colorStyle } from "styled-system";
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { ExtensionSDK } from "@looker/extension-sdk";


export const StyledInputText = styled(InputText as any)`
    border:0;
    border-top:1.5px solid;
    border-radius:0;
    border-color:#edeeef;
    background: transparent;
  &:hover {
    outline: 0;
    box-shadow:0;
    border-color:#edeeef;
  }
  &:focus,
  :focus-within {
    box-shadow: 0 0 0 0;
    border-color:#edeeef;
  }
  }

`

const scrollToRef = (ref:any) => window.scrollTo(0, ref.current.offsetTop)  


export function Messages(props:any){
     const myRef = useRef(null)
     const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

    const onSubmit = (e:any) => {
        e.preventDefault();
        // update the state
        var newMessage:message ={'messageSender':'user','message':props.currentMessage};
        props.sendNewMessage(newMessage);
        props.updateCurrent('');
    }

    const onChange = (e:any) => {
        props.updateCurrent(e.currentTarget.value)
    }

    // scroll to new messages
    useEffect(()=>{
        const { extensionSDK } = extensionContext;
        if(props.messages.length> 0 && props.messages[props.messages.length-1].messageSender!='bot'){
            const { extensionSDK } = extensionContext;
            props.receiveMessage(extensionSDK);
        }
        scrollToRef(myRef);
    },[props.messages])
   

    return(
        <>
        {/* height="100%" display="flex" flexDirection="column" */}
        <Box height="100%" display="flex" flexDirection="column" >
            <Box padding=".5rem" marginTop="0" marginBottom=".25rem" backgroundColor="rgb(45, 126, 234)" height="2rem" width="100%">
                <Paragraph fontWeight="bold" color="white"> LookerDemoBot</Paragraph>
            </Box>
        {/* position="absolute" bottom="0"  */}
            <Box margin=".5rem" overflowY="auto" flex={1} > 
                <List>
                    {props.messages.map((value:message, index:number) => {
                        return( <Message key={index} sender={value.messageSender} message={value.message}/>)
                    })
                    }
                </List>
                <div style={{ float:"left", clear: "both" }} ref={myRef}></div>
            </Box>
            <Box height="2rem" width="100%" marginTop="auto" marginBottom=".5rem">
                <Form height="100%" onSubmit={onSubmit} marginBottom={0}>
                    <StyledInputText value={props.currentMessage} onChange={onChange} placeholder="Enter your message here..." />
                </Form>
            </Box>
        </Box>
        </>
    )
}

export function Message(props:any){
    return(
            <>
            { props.sender === "bot" ? 
            <ListItem maxWidth="80%" style={{float: "left", clear: "both", margin:".25rem"}}>
                <Badge intent="neutral"><Paragraph margin=".3rem" fontSize="small" fontWeight="normal">{props.message}</Paragraph></Badge>
            </ListItem>
            : 
            <ListItem maxWidth="70%" style={{float: "right", clear: "both", margin:".25rem"}}>
                <Badge intent="inform"><Paragraph margin=".3rem" fontSize="small" fontWeight="normal">{props.message}</Paragraph></Badge>
            </ListItem>
            }
            </>
    )
}


const mapStatetoProps = ( state:any ) => {
    return {
        messages: state.messages,
        currentMessage: state.currentMessage
    }
} 
const mapDispatchtoProps = ( dispatch:any ) => {
    return {
        sendNewMessage: (message: message) => dispatch(addMessages(message)),
        updateCurrent: (currentMessage: string) => dispatch(onChange(currentMessage)),
        receiveMessage: (extensionSDK: ExtensionSDK) => dispatch(receiveMessage(extensionSDK))
    }
} 

export default connect(mapStatetoProps,mapDispatchtoProps)(Messages);



// const getMessage = async (body:Object) => {
        //     const response = await extensionSDK.fetchProxy(
        //         "https://us-central1-intricate-reef-291721.cloudfunctions.net/lookerdemo_chat",
        //         {
        //             method: 'POST',
        //             headers: {
        //             "Content-Type": "application/json"
        //             },
        //             body: JSON.stringify(body)
        //         }
        //     );
        //     if (response.ok) {
        //         setSessionID(response.body.session_id);
        //         var newMessage:message ={'messageSender':'user','message':response.body.message};
        //         props.sendNewMessage(newMessage);
        //     } else {
        //         console.log('Problem sending / receiving response to chatbot ', response.body)
        //     }
           
        // }
        // // send the last message to the chatbot
        // if(props.messages.length> 0 && props.messages[props.messages.length-1].messageSender!='bot'){
        //     let last_message = props.messages[props.messages.length-1].message;
        //     if(sessionId){
        //         getMessage({"text":last_message, "session_id":sessionId})
        //     } else {
        //         getMessage({"text":last_message})
        //     }
        // }