import {
    SET_MONSTER
} from '../config/constants'

const initialState = []

const monstersReducer = (state = initialState, action) => {
    const prev = [...state]

    switch (action.type) {
        case SET_MONSTER:
            return prev.concat(action.payload)

        default:
            return state
    }
}

export default monstersReducer