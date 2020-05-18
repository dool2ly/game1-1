import { CREATE_ALERT, CLOSE_ALERT } from '../config/constants'

  export const createAlert = (contents) => {
    return {
      type: CREATE_ALERT,
      payload: contents
    }
  }
  
  export const closeAlert = () => {
    return {
      type: CLOSE_ALERT
    }
  }

  export const createAlert2 = (contents) => {
    return (dispatch, getState) => {
      dispatch({
        type: CREATE_ALERT,
        payload: contents
      })
    }

  }