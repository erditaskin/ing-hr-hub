import { defineModule } from '../../core/utils/module';
import routes from './routes';
import reducers from './reducers';
import { EmployeeListPage } from './pages/EmployeeList';
import { EmployeePage } from './pages/Employee';

export default defineModule('Employee', { reducers }, routes, {
  'employee-list-page': EmployeeListPage,
  'employee-page': EmployeePage,
});
