import { SHOW_LIST, ADD_ARTICLE, DEL_ARTICLE, UPDATE_ARTICLE,
    UPDATE_TITLE, CHANGE_EDITING, CHANGE_SCREEN } from '../constants/actionTypes';


function makeActionCreator(type, ...argNames) {
    return (...args) => {
        const action = { type };
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });
        return action;
    };
}

export const showList = makeActionCreator(SHOW_LIST);
export const addArticle = makeActionCreator(ADD_ARTICLE, 'date');
export const delArticle = makeActionCreator(DEL_ARTICLE, 'date');
export const updateArticle = makeActionCreator(UPDATE_ARTICLE, 'body');
export const updateTitle = makeActionCreator(UPDATE_TITLE, 'title');
export const changeEditing = makeActionCreator(CHANGE_EDITING, 'date');
export const changeScreen = makeActionCreator(CHANGE_SCREEN, 'show');
