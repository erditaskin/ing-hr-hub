import { Reducer } from '@reduxjs/toolkit';
import { IRoute } from './route';

export interface IReducer {
  [moduleName: string]: Reducer;
}

export interface IModule {
  title: string;
  reducers: IReducer;
  routes: IRoute[];
  moduleKey?: string;
  components?: {
    [key: string]: CustomElementConstructor;
  };
}

export type IModules = {
  [key: string]: IModule;
};
