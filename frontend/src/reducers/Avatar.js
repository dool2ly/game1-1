import {
    SET_AVATAR,
    UNSET_AVATAR,
    MOVE_AVATAR,
    RESET_AVATAR,
    ATTACK_AVATAR
} from '../config/constants'

const initialState = []
//ex [{ name: 'avatarName', location: [x,y]}]

const avatarsReducer = (state = initialState, action) => {
    const prev = [...state]

    switch (action.type) {
        case SET_AVATAR:
            let addFlag = true
            const ret = prev.map(item => {
                if (item.name === action.payload.name) {
                    addFlag = false
                    return { ...action.payload }
                } else {
                    return item
                }
            })

            if (addFlag) {
                return ret.concat(action.payload)
            }
            
            return ret

        case ATTACK_AVATAR:
            return prev.map(
                item => item.name === action.payload.name
                ? { ...item, attack: Date.now() }
                : item
            )

        case MOVE_AVATAR:
            return prev.map(
                item => item.name === action.payload.name
                ? { ...item, ...action.payload }
                : item
            )

        case UNSET_AVATAR:
            return prev.filter(item => item.name !== action.payload.name)
        
        case RESET_AVATAR:
            return initialState

        default:
            return state
    }
}
export default avatarsReducer
