# Project Structure Documentation

This document provides an overview of the Dataset Publishing Platform's project structure, organization principles, and code patterns.

## Directory Structure

```
Dataset-publishing/
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── migrations/          # Database migrations
├── public/                  # Static assets served by Next.js
├── src/                     # Application source code
│   ├── app/                 # Next.js App Router components and routes
│   │   ├── api/             # API route handlers
│   │   │   └── datasets/    # Dataset-related API routes
│   │   │       ├── upload/  # File upload endpoint
│   │   │       └── [id]/    # Dataset-specific operations
│   │   │           └── metadata/ # Metadata operations
│   │   ├── (routes)/        # Page routes and layouts
│   │   ├── context/         # React context providers
│   │   ├── globals.css      # Global CSS styles
│   │   └── layout.tsx       # Root layout component
│   ├── components/          # Reusable React components
│   │   ├── datasets/        # Dataset-specific components
│   │   ├── layout/          # Layout components (header, footer, etc.)
│   │   └── ui/              # Generic UI components (buttons, inputs, etc.)
│   │       ├── Button.tsx   # Reusable button component
│   │       ├── Footer.tsx   # Footer component
│   │       └── Header.tsx   # Header component
│   ├── constants/           # Application constants and configuration
│   │   └── index.ts         # Centralized constants
│   ├── lib/                 # Core libraries and initialization
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── aiMetadata.ts    # AI integration for metadata
│   ├── services/            # Business logic services
│   │   ├── datasetService.ts # Dataset-related services
│   │   ├── fileService.ts   # File processing services
│   │   └── metadataService.ts # Metadata generation services
│   ├── types/               # TypeScript type definitions
│   │   ├── api.types.ts     # API-related types
│   │   ├── dataset.types.ts # Core dataset types
│   │   ├── file.types.ts    # File-related types
│   │   └── metadata.types.ts # Metadata-related types
│   └── utils/               # Utility functions
│       ├── formatting.ts    # Text and data formatting utilities
│       ├── validation.ts    # Input validation utilities
│       └── errorHandling.ts # Error handling utilities
├── .env                     # Environment variables (not committed to version control)
├── next.config.ts           # Next.js configuration
├── package.json             # NPM dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration for TailwindCSS
├── tailwind.config.js       # TailwindCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Organization Principles

### 1. Separation of Concerns

The codebase separates concerns by:

- **Pages (app directory)**: Handles routing and page-level layout
- **Components**: Encapsulates UI elements, organized by domain and reusability
- **Services**: Manages business logic and data operations
- **Utils**: Provides pure utility functions with no side effects
- **Types**: Centralizes type definitions for type safety

### 2. Domain-Driven Organization

Components and services are organized by domain or feature:

- **Dataset**: Components and services for dataset management
- **File**: Components and services for file upload and processing
- **Metadata**: Components and services for metadata generation and editing

### 3. Layered Architecture

The application follows a layered architecture:

1. **Presentation Layer**: React components in `/components`
2. **Application Layer**: Services in `/services` and API routes in `app/api`
3. **Infrastructure Layer**: Database access in Prisma client

## Code Patterns

### Component Patterns

- **Composition**: Complex components are built by composing smaller components
- **Container/Presentation**: Separation of data fetching from presentation
- **Context Providers**: For global state management
- **Hooks**: For reusable stateful logic
- **Reusable UI Components**: Shared components in the `/ui` directory

Example component structure:

```tsx
/**
 * Component Description
 *
 * Detailed description of what the component does and how to use it
 *
 * @param props - Description of component props
 */
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // State and hooks first
  const [state, setState] = useState();

  // Event handlers next
  const handleEvent = () => {
    // ...
  };

  // Return JSX last
  return <div>{/* Components with clear organization */}</div>;
}
```

### Service Patterns

- **Single Responsibility**: Each service focuses on a specific domain
- **Dependency Injection**: Dependencies are passed as parameters
- **Explicit Return Types**: All functions have explicit TypeScript return types
- **Error Handling**: Consistent error handling patterns

Example service structure:

```ts
/**
 * Service Description
 *
 * Detailed description of what the service does
 */

/**
 * Function Description
 *
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
export function serviceFunction(param1: Type): ReturnType {
  // Implementation
}
```

### Type Definition Patterns

- **Domain-Specific Files**: Types are organized into domain-specific files
- **Re-exports**: Core `dataset.types.ts` re-exports from domain-specific files
- **Documentation**: All types have JSDoc comments
- **Naming Conventions**: Consistent naming with suffixes like `Input`, `Response`, etc.

Example type structure:

```ts
/**
 * Type Name
 *
 * Description of what this type represents
 */
export interface TypeName {
  /** Description of property */
  property: string;
}
```

## Constants and Configuration

- Application constants are organized by domain in dedicated files:
  - `/constants/uploads.ts` - File upload and processing constants
  - `/constants/ai.ts` - AI service settings and prompt templates
  - `/constants/env.ts` - Environment variable handling
- Constants are re-exported through `/constants/index.ts` for easy imports
- Only essential configuration (database connection, API keys) is in environment variables
- Other configuration is managed through constants files for better type safety and defaults

## Error Handling

- Error handling is consistent across the application via the `errorHandling.ts` utility
- API responses have a standard format
- Client-side errors use toast notifications
- All errors are logged with contextual information

## Styling

- TailwindCSS is used for styling components
- Custom utility classes in `globals.css` augment Tailwind when needed
- Components are responsive by default
- Consistent spacing and color usage throughout the app
- Proper cursor styling through global rules for interactive elements

## Best Practices

1. **Code Consistency**: Follow established patterns for new code
2. **Documentation**: All components, services, and types should have JSDoc comments
3. **Testing**: Write tests for critical functionality
4. **Performance**: Consider performance implications, especially for file processing
5. **Accessibility**: Ensure components are accessible
