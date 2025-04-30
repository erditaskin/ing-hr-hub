import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { modules } from '../../modules';
import { getModuleReducerKeys } from '../utils/module';
import { ICoreState } from '../interfaces';
import { IEmployeeState } from '@/modules/employee/interfaces/employee';
import { IDashboardState } from '@/modules/dashboard/interfaces';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['core', ...getModuleReducerKeys(modules)],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export interface RootState {
  core: ICoreState;
  dashboard: IDashboardState;
  employee: IEmployeeState;
}

export type AppState = RootState & PersistPartial;
export type AppDispatch = typeof store.dispatch;
