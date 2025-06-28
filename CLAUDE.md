# GDG Website - Claude Development Notes

## Project Overview
Google Developer Group (GDG) website for University of Toronto Scarborough built with Next.js 15, TypeScript, Tailwind CSS v4, and Firebase.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (custom implementation)
- **Backend**: Firebase (Auth + Firestore)
- **State Management**: React Context + TanStack Query

## Development Commands

### Start Development
```bash
npm run dev          # Start Next.js development server (localhost:3000)
npm run emulators    # Start Firebase emulators (Auth: 9099, Firestore: 8080, UI: 4000)
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Firebase
```bash
npm run emulators           # Start all emulators with data persistence
npm run firestore:export   # Export production Firestore data to ./firebase-data
```

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── account/           # Account pages (/account, /account/login)
│   ├── projects/          # Projects page
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # App providers (TanStack Query, Toaster, etc.)
│   └── globals.css        # Global styles with Tailwind v4
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Page sections (Hero, About, Events, etc.)
│   ├── projects/          # Project-related components
│   ├── ui/                # shadcn/ui components (minimized)
│   └── login-form.tsx     # Functional login form
├── contexts/
│   └── AuthContext.tsx    # Firebase Auth context provider
├── lib/
│   ├── firebase.ts        # Firebase config with emulator setup
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## Firebase Setup
- **Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080  
- **Emulator UI**: http://localhost:4000
- **Data Persistence**: ./firebase-data/ (auto-import/export)

## Authentication
- Email/password login
- Google OAuth
- Auth state managed via React Context
- Auto-redirect after login/logout
- Protected routes (account page)

## UI Components (Active)
Only essential components are kept:
- `button`, `card`, `input`, `label` (actively used)
- `toast`, `toaster`, `sonner`, `tooltip` (providers)
- `dialog`, `separator`, `sheet`, `skeleton`, `toggle` (dependencies)

## Key Features
- Responsive design with mobile-first approach
- Dark theme with gradient backgrounds
- Firebase Auth with emulator support
- Protected account page
- Dynamic header (Login/Account button based on auth state)
- Form validation and error handling

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Development Notes
- AuthProvider wraps entire app in layout.tsx (not just providers)
- Firebase emulators auto-connect in development mode
- All unused shadcn/ui components have been removed
- Login form includes both email/password and Google OAuth
- Global dark background applied via Tailwind CSS