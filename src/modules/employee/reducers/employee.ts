import { createSlice } from '@reduxjs/toolkit';
import { IEmployeeState, IEmployee } from '../interfaces/employee';
import { ITableSettingsState } from '@/core/interfaces/table';

export const EMPLOYEE_SLICER = '@Employee/Slicer';

const initialTable: ITableSettingsState = {
  currentPage: 1,
  itemsPerPage: 10,
  visibleColumns: [],
  sortColumn: '',
  sortDirection: 'asc',
  selectedRows: [],
  filters: {},
};

const initialState: IEmployeeState = {
  data: [],
  table: initialTable,
};

const employeeSlice = createSlice({
  name: EMPLOYEE_SLICER,
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      state.data.push(action.payload);
    },
    addEmployees: (state, action) => {
      // Filter out duplicates based on email
      const existingEmails = new Set(state.data.map((emp: IEmployee) => emp.email));
      const newEmployees = action.payload.filter(
        (emp: IEmployee) => !existingEmails.has(emp.email)
      );

      state.data.push(...newEmployees);
    },
    updateEmployee: (state, action) => {
      const index = state.data.findIndex(employee => employee.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.data = state.data.filter(employee => employee.id !== action.payload);
    },
    setEmployeeTableCurrentPage: (state, action) => {
      state.table.currentPage = action.payload;
    },
    setEmployeeTableItemsPerPage: (state, action) => {
      state.table.itemsPerPage = action.payload;
    },
    setEmployeeTableVisibleColumns: (state, action) => {
      state.table.visibleColumns = action.payload;
    },
    setEmployeeTableSortColumn: (state, action) => {
      state.table.sortColumn = action.payload;
    },
    setEmployeeTableSortDirection: (state, action) => {
      state.table.sortDirection = action.payload;
    },
    setEmployeeTableFilters: (state, action) => {
      state.table.filters = action.payload;
    },
    setEmployeeTableSelectedRow: (state, action) => {
      state.table.selectedRows = action.payload;
    },
    resetEmployeeTableVisibleColumns: state => {
      state.table.visibleColumns = [];
    },
    resetEmployeeTablePagination: state => {
      state.table.currentPage = 1;
      state.table.itemsPerPage = 10;
    },
    resetEmployeeTableFilters: state => {
      state.table.filters = {};
    },
    resetEmployeeTableData: state => {
      state.data = [];
    },
    resetEmployeeState: () => initialState,
  },
});

export const {
  addEmployee,
  addEmployees,
  updateEmployee,
  deleteEmployee,
  setEmployeeTableCurrentPage,
  setEmployeeTableItemsPerPage,
  setEmployeeTableVisibleColumns,
  setEmployeeTableSortColumn,
  setEmployeeTableSortDirection,
  setEmployeeTableFilters,
  setEmployeeTableSelectedRow,
  resetEmployeeState,
  resetEmployeeTableVisibleColumns,
  resetEmployeeTablePagination,
  resetEmployeeTableFilters,
  resetEmployeeTableData,
} = employeeSlice.actions;

export default employeeSlice.reducer;
