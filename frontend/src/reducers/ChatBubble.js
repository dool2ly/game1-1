import { CREATE_CHAT, CLOSE_CHAT } from '../config/constants'

const initialState = [
]
  
const ChatBubble = (state=initialState, action) => {
  const prev = [...state]
  switch(action.type) {
    case CREATE_CHAT:
      return prev.filter(item => {
          if (action.payload.chat.from === item.chat.from) {
              clearTimeout(item.timer)
              return false
          }
          return true
      }).concat(action.payload)
      
    case CLOSE_CHAT:
      return prev.filter(item => item.chat.from !== action.payload)
      
    default:
      return state
  }
}

export default ChatBubble
  