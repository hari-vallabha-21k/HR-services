# HV Consultancy Frontend

A modern React + TypeScript + Vite + Tailwind CSS frontend application for HV Consultancy.

## Project Structure

```
hv-consultancy-frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context (Auth)
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities & Supabase client
│   ├── pages/            # Page components
│   ├── types/            # TypeScript definitions
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase-schema.sql   # Database schema
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── tailwind.config.js    # Tailwind config
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Supabase credentials to `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Technologies

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend & Authentication
- **ESLint** - Code linting

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## License

MIT
