import { applyMiddleware, createStore } from 'redux'
import { reducer } from './reducers'
import { sagaCallbacks } from './sagas'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

const registerSagas = (callbacks: any[]) => {
  callbacks.forEach((callback) => sagaMiddleware.run(callback))
}


export const configureStore = () => {
    const store: any = createStore(reducer,applyMiddleware(sagaMiddleware))

    if(module.hot) {
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers').default;
            store.replaceReducer(nextReducer);
        });
        }

    
    registerSagas([sagaCallbacks])
    return store
}

