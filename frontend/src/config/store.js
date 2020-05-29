import { createStore, combineReducers } from 'redux'

import user from '../reducers/User'
import chat from '../reducers/ChatBubble'
import avatars from '../reducers/Avatars'
import portal from '../reducers/AlertPortal'


const rootReducer = combineReducers({
    user: user,
    chat: chat,
    portal: portal,
    avatars: avatars
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store