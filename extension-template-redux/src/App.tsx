import React, { useState } from 'react'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import Extension from './components/Extension/Extension'
import { ComponentsProvider , Flex, Spinner} from '@looker/components'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from './data/store'

export const App: React.FC<{}> = hot(() => {

//   const loading = (
//     <Flex width="100%" height="90%" alignItems="center" justifyContent="center">
//       <Spinner color="black" />
//     </Flex>
//   )

                // loadingComponent={loading}
                // requiredLookerVersion=">=7.0.0">

  return (
    <Provider store={configureStore()}>
        <BrowserRouter>
            <ExtensionProvider>
                <ComponentsProvider>
                    <Extension/>
                </ComponentsProvider>
            </ExtensionProvider>
        </BrowserRouter>
    </Provider>
  )
})