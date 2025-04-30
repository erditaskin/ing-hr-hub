import { combineReducers } from '@reduxjs/toolkit';
import coreReducer from './core';
import { modules } from '../../../modules';
import { combineModuleReducers } from '../../utils/module';

const rootReducer = combineReducers({
  core: coreReducer,
  ...combineModuleReducers(modules),
});

export default rootReducer;
