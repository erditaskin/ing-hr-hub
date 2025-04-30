// Import providers
import './core/providers/ThemeProvider';
import './core/providers/LocalizationProvider';
import './core/providers/ReduxProvider';

// Import containers
import './core/containers/Root';
import './core/containers/AppRouter';

// Import store
import './core/store';

// Initialize app
const app = document.createElement('app-container');

document.body.appendChild(app);

// Add error handling
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
});
