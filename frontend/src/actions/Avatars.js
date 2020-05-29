import { SET_AVATAR, UNSET_AVATAR, MOVE_AVATAR } from '../config/constants'

export const setAvatar = (name, location) => {
    return {
        type: SET_AVATAR,
        payload: {
            name,
            location,
            canvasRef: null
        }
    }
}

export const moveAvatar = (name, location) => {
    return {
        type: MOVE_AVATAR,
        payload: {
            name,
            location
        }
    }
}