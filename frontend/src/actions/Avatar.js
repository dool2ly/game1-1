import {
    SET_AVATAR,
    UNSET_AVATAR,
    MOVE_AVATAR,
    RESET_AVATAR,
    ATTACK_AVATAR
} from '../config/constants'

export const setAvatar = (name, location, direction) => {
    return {
        type: SET_AVATAR,
        payload: {
            name,
            location,
            direction,
            active: true,
            attack: 0
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

export const attackAvatar = (name) => {
    return {
        type: ATTACK_AVATAR,
        payload: {
            name
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