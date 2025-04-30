import { IRoute } from '../../core/interfaces/route';

const Routes: IRoute[] = [
  {
    path: '/employees',
    component: 'employee-list-page',
    name: 'employee-list',
  },
  {
    path: '/employee/:id?',
    component: 'employee-page',
    name: 'employee',
  },
];

export default Routes;
