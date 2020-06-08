import {
    SET_MONSTER,
    MOVE_MONSTER,
    UNSET_MONSTER,
    RESET_MONSTER
} from '../config/constants'

const initialState = []

const monstersReducer = (state = initialState, action) => {
    const prev = [...state]

    switch (action.type) {
        case SET_MONSTER:
            return prev.concat(action.payload)
        
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