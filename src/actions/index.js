import { SHOW_LIST, ADD_ARTICLE, DEL_ARTICLE, UPDATE_ARTICLE,
    UPDATE_TITLE, CHANGE_EDITING, CHANGE_SCREEN } from '../constants/actionTypes';


export function showList() {
    return {
        type: SHOW_LIST
    };
}

export function addArticle(date) {
    return {
        type: ADD_ARTICLE,
        date
    };
}

export function delArticle(date) {
    return {
        type: DEL_ARTICLE,
        date
    };
}

export function updateArticle(body) {
    return {
        type: UPDATE_ARTICLE,
        body
    };
}

export function updateTitle(title) {
    return {
        type: UPDATE_TITLE,
        title
    };
}

export function changeEditing(date) {
    return {
        type: CHANGE_EDITING,
        date
    };
}

export function changeScreen(show) {
    return {
        type: CHANGE_SCREEN,
        show
    };
}
