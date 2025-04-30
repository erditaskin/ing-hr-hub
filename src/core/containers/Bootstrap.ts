// Bootstrap the application

import { store } from '../store';
import { setUser } from '../store/reducers/core';
import { IUserRole } from '../interfaces/user';

export async function bootstrap() {
  try {
    // Mock user authentication
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      avatar: null,
      role: IUserRole.OPERATOR,
    };
    store.dispatch(setUser(mockUser));
    console.log('[Bootstrap] Mock user initialized:', mockUser);

    // Here we can add more initialization steps like:
    // - Real authentication check
    // - Loading user preferences
    // - Feature flags
    // - App configuration
    // etc.

    console.log('[Bootstrap] Application initialized successfully');
    return true;
  } catch (error) {
    console.error('[Bootstrap] Failed to initialize application:', error);
    return false;
  }
}
