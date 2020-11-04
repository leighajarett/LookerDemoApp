export const ADD_MESSAGES='ADD_MESSAGES';
export const ON_CHANGE='ON_CHANGE';
export const UPDATE_SESSION='UPDATE_SESSION'
export const RECEIVE_MESSAGE='RECEIVE_MESSAGE';
import { message, response } from './reducers'
import { ExtensionSDK } from '@looker/extension-sdk';

export interface Action {
    type: string
    payload?: message | string | response | ExtensionSDK,
  }

export function addMessages(message: message) {
    return {type:ADD_MESSAGES, payload:message};
}

export function onChange(currentMessage: string) {
    return { type:ON_CHANGE,payload:currentMessage};
}

export function updateSession(sessionId: string) {
    return { type:UPDATE_SESSION,payload:sessionId};
}

export function receiveMessage(extensionSDK: ExtensionSDK) {
    return { type:RECEIVE_MESSAGE, payload: extensionSDK};
}