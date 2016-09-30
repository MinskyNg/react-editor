import { SHOW_LIST } from '../constants/actionTypes';


export default function listVisible(state = false, action) {
    switch (action.type) {
        case SHOW_LIST:
            return !state;
        default:
            return state;
    }
}
