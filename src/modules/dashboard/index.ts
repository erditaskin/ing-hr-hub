import { defineModule } from '../../core/utils/module';
import { Dashboard } from './pages/Dashboard';
import reducers from './reducers';
import routes from './routes';

export default defineModule('Dashboard', { reducers }, routes, {
  'dashboard-page': Dashboard,
});
