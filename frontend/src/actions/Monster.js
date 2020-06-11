import {
    SET_MONSTER,
    MOVE_MONSTER,
    RESET_MONSTER,
    UNSET_MONSTER,
    ATTACK_MONSTER
} from '../config/constants'

export const setMonster = (id, name, location, hp) => {
    return {
        type: SET_MONSTER,
        payload: {
            id,
            name,
            location,
            hp,
            attack: 0
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

export const attackMonster = (name) => {
    return {
        type: ATTACK_MONSTER,
        payload: {
            name
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