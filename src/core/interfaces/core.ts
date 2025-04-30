import { ILocale } from './locale';
import { IUser } from './user';

export interface ICoreState {
  user: IUser | null;
  locale: ILocale | null;
}
