import {
    SET_MONSTER,
    MOVE_MONSTER,
    RESET_MONSTER,
    UNSET_MONSTER
} from '../config/constants'

export const setMonster = (id, name, location) => {
    return {
        type: SET_MONSTER,
        payload: {
            id,
            name,
            location
        }
    }
}

export const moveMonster = (id, location) => {
    return {
        type: MOVE_MONSTER,
        payload: {
            id,
            location
        }
    }
}

export const unsetMonster = (id) => {
    return {
        type: UNSET_MONSTER,
        payload: {
            id
        }
    }
}

export const resetMonster = () => {
    return {
        type: RESET_MONSTER
    }
}