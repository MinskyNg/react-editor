import { ADD_ARTICLE, DEL_ARTICLE, UPDATE_ARTICLE, UPDATE_TITLE,
    CHANGE_EDITING, } from '../constants/actionTypes';
import { fromJS } from 'immutable';


function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        return handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state;
    };
}

const handlers = {};

handlers[ADD_ARTICLE] = (state, action) => {
    const { date } = action;
    const newState = state.unshift(fromJS({ title: '新建文章', body: '# 新建文章', date }));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
};

handlers[DEL_ARTICLE] = (state, action) => {
    let { date } = action;
    const len = state.size;
    if (len === 1) {
        date = new Date();
        date = `${date.getFullYear()}-${date.getMonth() + 1}-
              ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return handlers[ADD_ARTICLE](state.delete(0), { date });
    }
    for (let index = 0; index < len; index++) {
        if (state.get(index).get('date') === date) {
            const newState = state.delete(index);
            localStorage.setItem('articles', JSON.stringify(newState));
            return newState;
        }
    }
};

handlers[UPDATE_ARTICLE] = (state, action) => {
    const { body } = action;
    const newState = state.update(0, x => x.set('body', body));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
};

handlers[UPDATE_TITLE] = (state, action) => {
    const { title } = action;
    const newState = state.update(0, x => x.set('title', title));
    localStorage.setItem('articles', JSON.stringify(newState));
    return newState;
};

handlers[CHANGE_EDITING] = (state, action) => {
    const { date } = action;
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
};


const articles = createReducer(fromJS([]), handlers);

export default articles;
