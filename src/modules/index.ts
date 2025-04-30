import { IModules } from '../core/interfaces/module';
import employeeModule from './employee';
import dashboardModule from './dashboard';

// Register all modules here
export const modules: IModules = {
  employee: employeeModule,
  dashboard: dashboardModule,
};

// Export combined routes from all modules
export const getModuleRoutes = () => {
  return Object.values(modules).flatMap(module => module.routes);
};
