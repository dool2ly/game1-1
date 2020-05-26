import { LOGIN, LOGOUT } from '../config/constants'

export const login = (token) => {
    return {
      type: LOGIN,
      payload: {
        token
      }
    }
}

// export const logout = () => {type: LOGOUT}

export const logout = () => {
  return {
    type: LOGOUT
  }
}