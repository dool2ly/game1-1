import { LOGIN, LOGOUT } from '../config/constants'

const initialState = {
  token: null
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN:
      return {
        ...action.payload
      }
    case LOGOUT:
      return {
        token: null
      }
    default:
      return state
  }
}

export default userReducer
