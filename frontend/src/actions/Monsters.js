import { SET_MONSTER } from '../config/constants'
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