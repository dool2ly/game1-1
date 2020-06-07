import { createStore, combineReducers } from 'redux'

import user from '../reducers/User'
import chat from '../reducers/ChatBubble'
import avatars from '../reducers/Avatars'
import monsters from '../reducers/Monsters'
import portal from '../reducers/AlertPortal'



const rootReducer = combineReducers({
    user: user,
    chat: chat,
    portal: portal,
    avatars: avatars,
    monsters: monsters
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store