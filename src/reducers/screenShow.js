import { CHANGE_SCREEN } from '../constants/actionTypes';


export default function screenShow(state = 2, action) {
    switch (action.type) {
        case CHANGE_SCREEN:
            return action.show;
        default:
            return state;
    }
}
