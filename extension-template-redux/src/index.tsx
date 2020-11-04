/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './App'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import Extension from './components/Extension/Extension'
import { ComponentsProvider } from '@looker/components'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from './data/store'

// Posts server
// export const POSTS_SERVER_URL =
//   process.env.POSTS_SERVER_URL || 'http://127.0.0.1:3000'

// Centralize setup of client ids, keys and scopes
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ''
export const GOOGLE_SCOPES =
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile'

  
window.addEventListener('DOMContentLoaded', (event) => {
  var root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.render(
    // <Provider store={configureStore()}>
    //     <BrowserRouter>
    //         <ExtensionProvider>
    //             <ComponentsProvider>
    //                 <Extension/>
    //             </ComponentsProvider>
    //         </ExtensionProvider>
    //     </BrowserRouter>
    // </Provider>
    <App />
  , root)
})




