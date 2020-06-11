import {
    SET_MONSTER,
    MOVE_MONSTER,
    RESET_MONSTER,
    UNSET_MONSTER,
    ATTACK_MONSTER,
    HIT_MONSTER
} from '../config/constants'

export const setMonster = (id, name, location, direction, hp) => {
    return {
        type: SET_MONSTER,
        payload: {
            id,
            name,
            location,
            direction,
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

export const hitMonster = (id, hp) => {
    return {
        type: HIT_MONSTER,
        payload: {
            id,
            hp
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