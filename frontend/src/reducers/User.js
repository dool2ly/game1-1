import { LOGIN_SUCCESS } from '../config/constants'

const initialState = {
  token: null
}

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return {
        ...action.payload
      }
    default:
      return state
  }
}

export default userReducer
