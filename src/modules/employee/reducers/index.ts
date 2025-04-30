import employee from './employee';

export default employee;

/*
We could have combined reducers like this:


import { combineReducers } from 'redux';
import employee from './employee';

export default combineReducers({
  employee,
});
*/
