import {
    SET_MONSTER,
    MOVE_MONSTER,
    UNSET_MONSTER,
    RESET_MONSTER,
    ATTACK_MONSTER,
    HIT_MONSTER
} from '../config/constants'

const initialState = []

const monstersReducer = (state = initialState, action) => {
    const prev = [...state]

    switch (action.type) {
        case SET_MONSTER:
            return prev.concat(action.payload)
        
        case ATTACK_MONSTER:
            return prev.map(
                item => item.name === action.payload.name
                ? { ...item, attack: Date.now() }
                : item
            )
 
        case HIT_MONSTER:
            return prev.map(item => {
                    if (item.id === action.payload.id) {
                        item.hp[0] = action.payload.hp
                    }
                    return item
                }
            )
        case MOVE_MONSTER:
            return prev.map(
                item => item.id === action.payload.id
                ? { ...item, ...action.payload }
                : item
            )

        case UNSET_MONSTER:
            return prev.filter(item => item.id !== action.payload.id)
        
        case RESET_MONSTER:
            return initialState

        default:
            return state
    }
}

export default monstersReducer