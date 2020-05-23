import { CREATE_ALERT, CLOSE_ALERT } from '../config/constants'

  export const createAlert = (contents) => {
    return {
      type: CREATE_ALERT,
      payload: contents
    }
  }
  
  export const closeAlert = (from) => {
    return {
      type: CLOSE_ALERT,
      payload: from
    }
  }