// import { getCore40SDK } from '@looker/extension-sdk-react'
import { all, call, put, takeEvery, select } from 'redux-saga/effects'
// import { Actions, allLooksSuccess, runLookSuccess, error, Action, State } from '.'
import { Action, addMessages, RECEIVE_MESSAGE } from './actions'
import { State, message, response } from './reducers'
import {
    ExtensionContext,
    ExtensionContextData,
    getCore40SDK,
  } from '@looker/extension-sdk-react'
import { useContext } from 'react';
import { FetchCustomParameters, ExtensionSDK } from '@looker/extension-sdk';


function* receiveMessageSaga(action: Action){
    console.log('my action ', action)
    const state:State = yield select()
    const extensionSDK = action.payload as ExtensionSDK;
    let last_message = state.messages[state.messages.length-1].message;
    var messageSend={};
    if(state.sessionId){
        messageSend = {"text":last_message, "session_id":state.sessionId}
    } else {
        messageSend = {"text":last_message}
    }
    const customParams:FetchCustomParameters = {
        method: 'POST',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(messageSend)
    };
    if(extensionSDK){
        const response = yield call([extensionSDK, extensionSDK.fetchProxy],
            "https://us-central1-intricate-reef-291721.cloudfunctions.net/lookerdemo_chat", 
            customParams)
    
        if(response.ok){
            yield put({type:'RECEIVE_MESSAGE_ASYNC', payload:{'message':response.body.message, 'sessionId':response.body.sessionId}})
        }
        else{console.log('Problem making call to dialogflow')}
    }
}


export function* sagaCallbacks() {yield all([takeEvery(RECEIVE_MESSAGE, receiveMessageSaga)])}
