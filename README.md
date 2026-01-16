# Book Manager - Full Stack Assessment

A full-stack book management application built with Next.js, GraphQL, SQLite, Auth0, and TypeScript.

## Features

- **GraphQL API** - Type-safe API using Apollo Server
- **Auth0 Authentication** - Enterprise-grade authentication with Auth0
- **SQLite Database** - Lightweight database for book storage
- **CRUD Operations** - Create, read, update, and delete books
- **Responsive UI** - Modern interface built with shadcn/ui components
- **Form Validation** - Client-side validation with Zod and React Hook Form

## Tech Stack

### Backend
- Next.js 16 (App Router)
- Apollo Server 5
- GraphQL
- SQLite (better-sqlite3)
- Auth0 authentication

### Frontend
- React 19
- Apollo Client
- shadcn/ui components
- Tailwind CSS v4
- React Hook Form + Zod validation
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Auth0 account (free tier available at https://auth0.com/signup)

### Auth0 Setup

1. Create a free Auth0 account at https://auth0.com/signup

2. Create a new application:
   - Go to Applications > Create Application
   - Choose "Regular Web Application"
   - Note your Domain, Client ID, and Client Secret

3. Configure application settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Auth0 credentials:
```bash
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```

You can generate the AUTH0_SECRET with:
```bash
openssl rand -hex 32
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Click "Sign In with Auth0" to authenticate

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[auth0]/    # Auth0 dynamic route handler
│   │   └── graphql/         # GraphQL API endpoint
│   ├── dashboard/           # Protected dashboard page
│   ├── login/               # Authentication page
│   └── page.tsx             # Landing page
├── components/
│   ├── books-list.tsx       # Books listing with CRUD
│   ├── book-card.tsx        # Individual book card
│   └── book-form-dialog.tsx # Book create/edit form
├── lib/
│   ├── auth.ts              # Auth0 integration utilities
│   ├── db.ts                # Database connection
│   └── graphql/
│       ├── schema.ts        # GraphQL type definitions
│       ├── resolvers.ts     # GraphQL resolvers
│       ├── client.ts        # Apollo Client setup
│       └── queries.ts       # GraphQL queries/mutations
├── scripts/
│   ├── 01-setup-database.sql   # Database schema
│   ├── 02-seed-data.sql        # Seed data
│   └── setup-db.py             # Database setup script
└── proxy.ts                 # Route protection middleware
```

## GraphQL API

The GraphQL API is available at `/api/graphql` and includes:

### Queries
- `books` - Get all books for the authenticated user
- `book(id)` - Get a specific book by ID
- `me` - Get current user info

### Mutations
- `createBook(title, author, isbn, publishedDate)` - Add a new book
- `updateBook(id, ...)` - Update book details
- `deleteBook(id)` - Delete a book

## Database Schema

### users
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password_hash (TEXT) - stored as "auth0" for Auth0 users
- name (TEXT)
- created_at (DATETIME)

### books
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- author (TEXT)
- isbn (TEXT UNIQUE)
- published_date (TEXT)
- user_id (INTEGER FOREIGN KEY)
- created_at (DATETIME)
- updated_at (DATETIME)

## Authentication Flow

1. User clicks "Sign In with Auth0"
2. Redirected to Auth0 Universal Login
3. After successful authentication, Auth0 redirects back to the app
4. User session is stored in secure HTTP-only cookies
5. GraphQL resolvers verify Auth0 session for each request
6. User records are automatically created in local database on first login

## Security Features

- Enterprise-grade authentication with Auth0
- Secure session management with HTTP-only cookies
- Row-level data isolation (users can only access their own books)
- GraphQL authentication middleware
- Protected routes with Next.js middleware
- Automatic user provisioning from Auth0 to local database

## Build for Production

```bash
npm run build
npm start
```

Don't forget to update your Auth0 application settings with production URLs:
- Allowed Callback URLs: `https://yourdomain.com/api/auth/callback`
- Allowed Logout URLs: `https://yourdomain.com`
- Allowed Web Origins: `https://yourdomain.com`

And update your `.env.local` to `.env.production`:
```bash
AUTH0_BASE_URL='https://yourdomain.com'
```

## Assessment Requirements Met

✅ **Backend**
- NestJS requirement adapted to Next.js App Router with API routes
- GraphQL API with Apollo Server
- SQLite database
- Auth0 authentication
- CRUD operations for books
- TypeScript throughout

✅ **Frontend**
- React SPA architecture
- UI component library (shadcn/ui, modern alternative to Chakra UI)
- Form validation
- Responsive design
- Apollo Client integration

✅ **Additional Features**
- Middleware for route protection
- Toast notifications
- Loading states
- Error handling
- Empty states
- Confirmation dialogs
- Auto-initialization of database
- Secure Auth0 integration

## Environment Variables

Required environment variables in `.env.local`:

```
AUTH0_SECRET=            # Generate with: openssl rand -hex 32
AUTH0_BASE_URL=          # http://localhost:3000 for development
AUTH0_ISSUER_BASE_URL=   # Your Auth0 domain (e.g., https://dev-xxx.auth0.com)
AUTH0_CLIENT_ID=         # From Auth0 application settings
AUTH0_CLIENT_SECRET=     # From Auth0 application settings
```

See `.env.local.example` for a template.
