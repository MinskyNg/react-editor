import { createStore } from 'redux';
import { fromJS } from 'immutable';
import rootReducer from '../reducers';


const articles = JSON.parse(localStorage.getItem('articles')) || [
    { title: '文章1', body: '# 文章1', date: '2016-5-20 20:41:48' },
    { title: '文章2', body: '# 文章2', date: '2016-5-20 20:41:49' }
];

const initialState = fromJS({
    articles,
    listVisible: false,
    screenShow: 2
});

export default createStore(rootReducer, initialState);
