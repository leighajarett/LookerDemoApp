import { ADD_MESSAGES, ON_CHANGE, UPDATE_SESSION, addMessages, Action } from './actions'
import { stateChart } from '@looker/components/lib/Form/Inputs/Combobox/utils/state'
// import { Reducer } from 'react'

export interface message {messageSender: string; message: string;}
export interface response {message: string; sessionId: string;}

export interface State {
    messages: message[],
    currentMessage: string,
    sessionId?:string
  }

// define initial messages so using proper type
const initialMessages: message[] = [{'messageSender':'bot', 'message':
    "Hi there, I'm the LookerDemoBot! I use dialogflow to help you find what you need."},
    {'messageSender':'bot', 'message':'How can I help you today?'}]

const initialState: State = {
    messages: initialMessages,
    currentMessage: ''
}

export const reducer = (state:State = initialState , action: Action):State => {
    switch(action.type){
        case ADD_MESSAGES:
            var newMessages:message[] = [];
            state.messages.forEach( (val: message) => newMessages.push(Object.assign({}, val)));
            newMessages.push(action.payload as message);
            return {...state,
                messages: newMessages
            }
        case ON_CHANGE:
            return {...state,
                currentMessage: action.payload as string
            }
        case "RECEIVE_MESSAGE_ASYNC":
            var pay = action.payload as response
            var newMessage:message ={'messageSender':'bot','message':pay.message}; 
            var newSession:string=pay.sessionId
            var newMessages:message[] = [];
            state.messages.forEach( (val: message) => newMessages.push(Object.assign({}, val)));
            newMessages.push(newMessage);
            return{
                ...state,
                sessionId: newSession,
                messages: newMessages
            }
        default:
            return state;
    }
} 

