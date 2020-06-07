import {
    SET_AVATAR,
    UNSET_AVATAR,
    MOVE_AVATAR,
    RESET_AVATAR
} from '../config/constants'

export const setAvatar = (name, location, active) => {
    return {
        type: SET_AVATAR,
        payload: {
            name,
            location,
            active: true
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

export const unsetAvatar = (name) => {
    return {
        type: UNSET_AVATAR,
        payload: {
            name,
        }
    }
}

export const resetAvatar = () => {
    return {
        type: RESET_AVATAR
    }
}