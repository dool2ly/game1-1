import { createStore, combineReducers } from 'redux'

import user from '../reducers/User'
import chat from '../reducers/ChatBubble'
import avatar from '../reducers/Avatar'
import monster from '../reducers/Monster'
import portal from '../reducers/AlertPortal'



const rootReducer = combineReducers({
    user: user,
    chat: chat,
    portal: portal,
    avatar: avatar,
    monster: monster
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store