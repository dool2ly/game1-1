import { LOGIN_SUCCESS } from '../config/constants'

export const loginSuccess = (token) => {
    return {
      type: LOGIN_SUCCESS,
      payload: {
        token
      }
    }
  }
  