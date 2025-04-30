# ING HR Hub

A modern web application built with Lit Elements for managing HR operations. This application follows a modular architecture pattern and uses modern web technologies to provide a responsive and efficient user experience.

## 🚀 Technologies

### Core Technologies

- **Lit** (v3.1.0) - For creating fast, lightweight web components
- **TypeScript** - For type-safe code development
- **Vite** - For fast, modern build tooling

### State Management

- **Redux Toolkit** - For centralized state management
- **Redux Persist** - For state persistence

### UI Components

- **Shoelace** - For modern, accessible UI components
- **Web Components** - Native browser component architecture

### Routing

- **Vaadin Router** - For client-side routing

### Development Tools

- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - Static type checking
- Vitest - Unit testing framework

## 📁 Project Structure

```
src/
├── core/           # Core application functionality
│   ├── components/ # Shared components
│   ├── forms/      # Form handling utilities
│   ├── interfaces/ # TypeScript interfaces
│   ├── services/   # Shared services
│   └── store/      # Redux store configuration
│
├── modules/        # Feature modules
│   └── employee/   # Employee management module
│       ├── components/
│       ├── interfaces/
│       ├── pages/
│       └── reducers/
│
├── translations/   # i18n translation files
└── main.ts        # Application entry point
```

## 🏗️ Architecture

### Module-Based Architecture

The application follows a module-based architecture where each feature is encapsulated in its own module (e.g., employee module). This promotes:

- Better code organization
- Feature isolation
- Scalability
- Maintainability

### Component Architecture

- Uses Lit Elements for creating web components
- Follows a component-based architecture
- Each component is self-contained with its own:
  - Styles (CSS)
  - Logic (TypeScript)
  - Template (HTML)

### State Management

- Centralized state management using Redux
- Modular state slices for each feature
- Persistent state storage with redux-persist

### Forms

- Custom form controller for form state management
- Validation system
- Error handling
- Event dispatching

## 🔧 Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## 🧰 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run validate` - Run linting and formatting checks

## 🌐 Features

- Employee Management
  - List view with sorting and filtering
  - Create/Edit/Delete operations
  - Form validation
  - Responsive design
- Internationalization (i18n)
- Responsive UI
- Modern form handling
- Data persistence
- Error handling

## 🔒 Best Practices

- TypeScript for type safety
- Component-based architecture
- Modular code organization
- Consistent code style (ESLint + Prettier)
- Responsive design
- Accessibility considerations
- Error boundary implementation
- Event-driven architecture
- Clean code principles

## 📚 Documentation

Each module and major component contains its own documentation. Key areas include:

- Component usage
- State management
- Form handling
- Routing
- Internationalization
- Type definitions

## 🛠️ Contributing

1. Follow the established project structure
2. Maintain type safety with TypeScript
3. Follow ESLint and Prettier configurations
4. Write clean, documented code
5. Create modular, reusable components
