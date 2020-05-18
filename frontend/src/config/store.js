import { createStore, combineReducers } from 'redux'

import portal from '../reducers/AlertPortal'


const rootReducer = combineReducers({
    portal: portal
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store