import { ICoreState, IUser } from '../../interfaces';
import { AppState } from '../index';
export const getCoreState = (state: AppState): ICoreState => state.core;
export const getUser = (state: AppState): IUser | null => getCoreState(state).user;
export const getUserName = (state: AppState) => {
  const user = state.core.user;
  return user ? `${user.firstName} ${user.lastName}` : undefined;
};
