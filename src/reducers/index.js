import { combineReducers } from 'redux-immutable';
import articles from './articles';
import listVisible from './listVisible';
import screenShow from './screenShow';


export default combineReducers({
    articles,
    listVisible,
    screenShow
});
