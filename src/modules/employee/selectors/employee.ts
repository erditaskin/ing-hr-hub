// employee selectors
// here

import { RootState } from '@/core/store';
import { IEmployee } from '../interfaces/employee';
import { ITableSettingsState } from '@/core/interfaces/table';

export const getEmployees = (state: RootState): IEmployee[] => state.employee.data;
export const getEmployeeTableSettings = (state: RootState): ITableSettingsState =>
  state.employee.table;
