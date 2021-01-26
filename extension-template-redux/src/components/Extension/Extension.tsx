import React, { useState, useContext, useEffect } from "react"
import { MenuList, MenuItem, Tooltip, Divider, DividerVertical, Box, Paragraph, Button, Heading, SpaceVertical } from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData
} from "@looker/extension-sdk-react"
import { Switch, Route, Link as RouterLink, Redirect, BrowserRouter, useHistory, useLocation} from 'react-router-dom'
import { hot } from "react-hot-loader/root"
import styled from 'styled-components';
import Home from './Home';
import DemoContent from '../Demo Content/DemoContent';
import DemoDetail from '../Demo Content/DemoDetail';
import Workshop from "../Workshops/Workshop"
import Admin from "../Admin/Admin"
import NewContent from "../New Content/NewContent"
import Tickets from "../Requests/Tickets"
import SidePanel from "./SidePanel"
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
    // POSTS_SERVER,
    GOOGLE_CLIENT_ID,
    GOOGLE_SCOPES
  } from '../..';
import LookerBot from "../LookerBot/LookerBot"

export enum ROUTES {
  HOME_ROUTE = '/',
  LOGIN_ROUTE = '/login',
  CONTENT_ROUTE = '/content',
  DEMO_ROUTE = '/content/:demoId',
  WORKSHOP_ROUTE = '/workshop',
  REQUESTS_ROUTE = '/requests',
  NEW_ROUTE = '/new', 
  NEW_NEW_ROUTE = '/new/new',
  LOG_NEW_ROUTE = '/new/log',
  ADD_NEW_ROUTE = '/new/add',
  INSTANCE_ROUTE = '/instances',
  ADMIN_ROUTE = '/admin',
}
 

export default function Extension(props: any){
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext);
  const { extensionSDK, core40SDK } = extensionContext;
  const [newDemos, setNewDemos] = useState([]);
  const [firebaseUser, setUser] = useState<firebase.User | null>(null);
  let history = useHistory();
  let location = useLocation();
  let state: any = location.state;
  let { from } = state || { from: { pathname: "/" } };

  var firebaseConfig = {
      apiKey: "AIzaSyCFi32mZ7iRphve5nlHzBOJtvqRtAukB60",
      authDomain: "intricate-reef-291721.firebaseapp.com",
      databaseURL: "https://intricate-reef-291721.firebaseio.com",
      projectId: "intricate-reef-291721",
      storageBucket: "intricate-reef-291721.appspot.com",
      messagingSenderId: "804547306614",
      appId: "1:804547306614:web:0657e4c2419c867040ab57",
      measurementId: "G-DDX6LB8302"
    };

  
  if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
  }

  var provider = new firebase.auth.GoogleAuthProvider();
  var auth = firebase.auth();

  const googleSignin = async () => {
      if(firebaseUser){
          firebase.auth().signOut()
          console.log('Signed Out ', firebase.auth().currentUser)
      }
      else{
          try {
              const response = await extensionSDK.oauth2Authenticate(
                  'https://accounts.google.com/o/oauth2/v2/auth',
                  {
                      client_id: GOOGLE_CLIENT_ID,
                      scope: GOOGLE_SCOPES,
                      response_type: 'token',
                  }
              )
              const { access_token, expires_in } = response
              var credential = firebase.auth.GoogleAuthProvider.credential(null, access_token);
              var signResponse = await auth.signInWithCredential(credential);
              setUser(firebase.auth().currentUser);
              history.replace(from);
          } catch (error) {
            console.log(error)
          }
      }
    }
  
  return (
      <Box display="flex" height="100%">
        <SidePanel/>
        <LookerBot/>
        <Box margin="1rem" marginRight="2rem" width="100%" >
          <Switch>
            <Route path={ROUTES.LOGIN_ROUTE}>
              <Box width="100%" height="100%" textAlign="center" marginTop="5%">
                <Heading>Welcome to the Demo Application!</Heading>
                <Paragraph>Please sign again in using your Google email to access relevant demo-content</Paragraph>
                <Button onClick={googleSignin} marginTop="2%">Sign In</Button>
              </Box>
            </Route>
            <Route path={ROUTES.REQUESTS_ROUTE}>
              <Tickets></Tickets>
            </Route>
            <Route path={ROUTES.INSTANCE_ROUTE}>
              These are my demo instances lalala
            </Route>
            <Route path={ROUTES.ADMIN_ROUTE}>
              <Admin></Admin>
            </Route>
            <Route path={ROUTES.WORKSHOP_ROUTE}>
              <Workshop></Workshop>
            </Route>
            <LoggedIn firebaseUser={firebaseUser} firebase={firebase} />
          </Switch>
        </Box>
    </Box>
  )
}

export function LoggedIn(props: any){
  console.log('Logged in props ', props)
  if(props.firebaseUser){
    return(
      <>
        <Route exact={true} path={ROUTES.HOME_ROUTE}>
          <Home firestore={props.firebase.firestore()}></Home> 
        </Route>
        <Route exact={true} path={ROUTES.CONTENT_ROUTE}>
          <DemoContent firestore={props.firebase.firestore()}></DemoContent>
        </Route>
        <Route path={ROUTES.NEW_ROUTE}>
          <NewContent firestore={props.firebase.firestore()}></NewContent>
        </Route>
        <Route path={ROUTES.DEMO_ROUTE} children={<DemoDetail firestore={props.firebase.firestore()}/>}/>
      </>
    )
  }
  else{
    return(<Redirect to={{
        pathname: ROUTES.LOGIN_ROUTE,
        state: { from: props.location }
      }} />)
  }
}
