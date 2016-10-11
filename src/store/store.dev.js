import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import { fromJS } from 'immutable';
import DevTools from '../containers/DevTools';
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

// 调用日志打印方法
const loggerMiddleware = createLogger();

// 创建一个中间件集合
const middleware = [loggerMiddleware];

// 利用compose增强store，这个store与applyMiddleware和redux-devtools一起使用
const finalCreateStore = compose(
    applyMiddleware(...middleware),
    DevTools.instrument()
)(createStore);

export default finalCreateStore(rootReducer, initialState);
