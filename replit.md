# replit.md

## Overview

This is a full-stack blog application built with React and Express.js, featuring a modern UI with shadcn/ui components, markdown-based content management, and an admin panel for content creation and management. The application uses TypeScript throughout and is configured for deployment on Replit.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (Neon Database)
- **Storage**: DatabaseStorage with PostgreSQL persistence and markdown file sync
- **API Design**: RESTful API with proper error handling and middleware
- **Development**: Hot reload with Vite integration

## Key Components

### Database Schema
- **Posts Table**: Stores blog post metadata (title, slug, content, excerpt, category, timestamps)
- **Users Table**: Basic user authentication (username, password)
- **Database Provider**: Configured for Neon Database with PostgreSQL dialect

### Authentication
- Simple password-based admin authentication
- Session management through environment variables
- Protected admin routes for content management

### Content Management
- **Markdown Support**: Posts stored as markdown files in `/posts` directory
- **Dynamic Loading**: Server reads markdown files and parses frontmatter
- **Admin Panel**: Full CRUD operations for blog posts
- **File System Integration**: Automatic loading of existing markdown files

### UI Components
- **shadcn/ui**: Comprehensive component library with dark/light theme support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback for actions

## Data Flow

### Content Retrieval
1. Client requests posts via TanStack Query
2. Express API fetches from PostgreSQL database via Drizzle ORM
3. Server returns JSON data with post metadata and content
4. Client renders markdown content using markdown-it

### Content Creation/Update
1. Admin authenticates via password
2. Form submission sends data to API endpoints
3. Server validates using Zod schemas
4. Updates PostgreSQL database and syncs with markdown files
5. Client receives confirmation and updates UI

### Post Display
1. URL routing captures post slug
2. API fetches specific post by slug
3. Markdown content rendered with syntax highlighting
4. Metadata displayed (category, read time, date)

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon Database
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **markdown-it**: Markdown parsing and rendering
- **zod**: Runtime type validation
- **date-fns**: Date formatting utilities

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite middleware integrated with Express
- **TypeScript**: Real-time compilation with tsx
- **Error Handling**: Runtime error overlay in development
- **Asset Serving**: Vite handles static assets and HMR

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Assets**: Express serves built frontend files
- **Database**: Migrations handled via Drizzle Kit

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **ADMIN_PASSWORD**: Admin authentication (defaults to "admin123")
- **NODE_ENV**: Environment detection for build optimization
- **Port Configuration**: Dynamic port assignment for Replit

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── posts/           # Markdown blog posts
├── migrations/      # Database migrations
└── dist/           # Production build output
```

The application is designed to be easily deployable on Replit with minimal configuration, supporting both development and production environments through environment variable detection.