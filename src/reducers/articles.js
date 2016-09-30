import { ADD_ARTICLE, DEL_ARTICLE, UPDATE_ARTICLE, UPDATE_TITLE,
    CHANGE_EDITING, } from '../constants/actionTypes';
import { fromJS } from 'immutable';


function add_article(state, date) {
    const newState = state.unshift(fromJS({ title: '新建文章', body: '# 新建文章', date }));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
}

function del_article(state, date) {
    const len = state.size;
    if (len === 1) {
        return add_article(state.delete(0), date);
    }
    for (let index = 0; index < len; index++) {
        if (state.get(index).get('date') === date) {
            const newState = state.delete(index);
            localStorage.setItem('articles', JSON.stringify(newState));
            return newState;
        }
    }
}

function update_article(state, body) {
    const newState = state.update(0, x => x.set('body', body));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
}

function update_title(state, title) {
    const newState = state.update(0, x => x.set('title', title));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
}

function change_editing(state, date) {
    const len = state.size;
    for (let index = 0; index < len; index++) {
        if (state.get(index).get('date') === date) {
            const editing = state.get(index);
            let newState = state.delete(index);
            newState = newState.unshift(editing);
            localStorage.setItem('articles', JSON.stringify(newState));
            return newState;
        }
    }
}

export default function articles(state = fromJS([]), action) {
    switch (action.type) {
        case ADD_ARTICLE:
            return add_article(state, action.date);
        case DEL_ARTICLE:
            return del_article(state, action.date);
        case UPDATE_ARTICLE:
            return update_article(state, action.body);
        case UPDATE_TITLE:
            return update_title(state, action.title);
        case CHANGE_EDITING:
            return change_editing(state, action.date);
        default:
            return state;
    }
}
