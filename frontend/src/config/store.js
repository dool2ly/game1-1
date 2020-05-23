import { createStore, combineReducers } from 'redux'

import portal from '../reducers/AlertPortal'
import user from '../reducers/User'
import chat from '../reducers/ChatBubble'


const rootReducer = combineReducers({
    portal: portal,
    user: user,
    chat: chat
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store