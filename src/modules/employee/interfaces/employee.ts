import { ITableSettingsState } from '@/core/interfaces';

export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfEmployment: string;
}

export interface IEmployeeState {
  data: IEmployee[];
  table: ITableSettingsState;
}
