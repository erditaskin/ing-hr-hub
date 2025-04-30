export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: IUserRole;
}

export enum IUserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
}
