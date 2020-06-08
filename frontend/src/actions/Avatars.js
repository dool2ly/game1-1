import {
    SET_AVATAR,
    UNSET_AVATAR,
    MOVE_AVATAR,
    RESET_AVATAR
} from '../config/constants'

export const setAvatar = (name, location, direction, active) => {
    return {
        type: SET_AVATAR,
        payload: {
            name,
            location,
            direction,
            active: true
        }
    }
}

export const moveAvatar = (name, location, direction) => {
    return {
        type: MOVE_AVATAR,
        payload: {
            name,
            direction,
            location
        }
    }
}

export const unsetAvatar = (name) => {
    return {
        type: UNSET_AVATAR,
        payload: {
            name
        }
    }
}

export const resetAvatar = () => {
    return {
        type: RESET_AVATAR
    }
}