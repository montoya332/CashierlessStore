import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import app from './app/reducer';
import user from './app/userReducer';

const rootReducer = combineReducers({
    app,
    router,
    user,
});

export default rootReducer;
