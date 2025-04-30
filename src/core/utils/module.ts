import { IModule, IModules, IReducer } from '../interfaces/module';
import { IRoute } from '../interfaces/route';

export const defineModule = (
  title: string,
  reducers: IReducer,
  routes: Array<IRoute>,
  components?: { [key: string]: CustomElementConstructor }
): IModule => {
  // Register components if provided
  if (components) {
    Object.entries(components).forEach(([name, constructor]) => {
      if (!customElements.get(name)) {
        customElements.define(name, constructor);
      }
    });
  }

  return { title, reducers, routes, components };
};

export const flatModules = (modules: IModules): IModule[] => {
  const flatModules = Object.keys(modules).map((x: string) => {
    const res: Array<IModule> = [modules[x]];
    res.forEach((y: IModule) => (y['moduleKey'] = x));
    return res;
  });
  return flatModules && flatModules.length > 0 ? flatModules.reduce((c, n) => c.concat(n), []) : [];
};

export const combineModuleReducers = (
  modules: IModules,
  isCoreModules: boolean = false
): IReducer => {
  const flat = flatModules(modules);
  return createReducersFromFlattenArray(flat, isCoreModules);
};

const createReducersFromFlattenArray = (flat: IModule[], isCoreModules: boolean) => {
  const reducers: IReducer = {};
  for (let i = 0; i < flat.length; i++) {
    const module = flat[i]['moduleKey'];
    const moduleReducers = flat[i].reducers;

    for (const key in moduleReducers) {
      if (checkIfDefineReducer(moduleReducers, key)) {
        let reducerName = module + (isCoreModules ? 'Core' : '');
        reducers[reducerName] = moduleReducers[key];
      } else {
        throw new Error('Module ' + i + ' does not define reducer!');
      }
    }
  }

  return reducers;
};

const checkIfDefineReducer = (moduleReducers: IReducer, key: string) => {
  return (
    Object.prototype.hasOwnProperty.call(moduleReducers, key) &&
    typeof moduleReducers[key] === 'function'
  );
};

export const getModuleRoutes = (modules: IModules) => {
  return Object.values(modules).flatMap(module => module.routes);
};

export const getModuleReducerKeys = (modules: IModules): string[] => {
  return Object.keys(modules);
};
