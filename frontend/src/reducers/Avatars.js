import React from 'react'
import { SET_AVATAR, UNSET_AVATAR, MOVE_AVATAR } from '../config/constants'

const initialState = []
//ex [{ name: 'avatarName', location: [x,y]}]

const avatarsReducer = (state = initialState, action) => {
    const prev = [...state]
    switch(action.type) {
        case SET_AVATAR:
            const canvasRef = React.createRef()
            action.payload.canvasRef = canvasRef
            return prev.filter(item => item.name !== action.payload.name).concat(action.payload)
        case MOVE_AVATAR:
            return prev.map(
                item => item.name === action.payload.name
                ? { ...item, ...action.payload}
                : item
            )
        default:
            return state
    }
}
export default avatarsReducer
