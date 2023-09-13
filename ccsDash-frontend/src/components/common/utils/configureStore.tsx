import {applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk';

import monitorReducerEnhancer from '../enhancers/monitorReducer';
import logger from '../middleware/logger';
import rootReducer from './reducers';

export default function configureStore(preloadedState) {
    const middlewares = [logger, thunkMiddleware]
    const middlewareEnhancer = applyMiddleware(...middlewares)

    const enhancers = [middlewareEnhancer, monitorReducerEnhancer]
    const composedEnhancers = compose(...enhancers)

    const store = createStore(rootReducer, preloadedState, composedEnhancers)

    return store
}