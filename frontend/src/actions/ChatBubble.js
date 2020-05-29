import { CREATE_CHAT, CLOSE_CHAT } from '../config/constants'

export const createChat = (chat, timer) => {
  return {
    type: CREATE_CHAT,
    payload: {
      chat,
      timer
    }
  }
}

export const closeChat = (from) => {
  return {
    type: CLOSE_CHAT,
    payload: from
  }
}
