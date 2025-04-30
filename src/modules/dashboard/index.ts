import { defineModule } from '../../core/utils/module';
import { DashboardPage } from './pages/DashboardPage';
import reducers from './reducers';
const routes = [
  {
    path: '/dashboard',
    component: 'dashboard-page',
    name: 'dashboard',
  },
];

export default defineModule('Dashboard', { reducers }, routes, {
  'dashboard-page': DashboardPage,
});
