# Shamba Intel

Shamba Intel is a farmer-focused weather and canopy analysis web app built on the Weather AI API. It provides localized weather dashboards and farm canopy insights for agricultural decision-making.

## Stack

- **React 18** + **TypeScript**
- **Vite** — bundler and dev server
- **Tailwind CSS v3** — utility-first styling
- **React Router v6** — client-side routing
- **Axios** — HTTP client for API calls
- **Zustand** — lightweight client UI state (ViewModel layer)
- **TanStack Query (React Query)** — server state, caching, loading/error handling
- **Chart.js** + **react-chartjs-2** — weather temperature charts

## Architecture (MVVM)

The codebase enforces strict layer separation:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Model** | `src/models/` | TypeScript interfaces for API payloads. Data shapes only — no UI, no state. |
| **Service** | `src/services/` | Axios calls and raw request/response handling. Typed promises only — no hooks, no Zustand. |
| **ViewModel** | `src/viewmodels/` | Zustand stores and React Query hooks. Business logic, derived state, side effects. No JSX. |
| **View** | `src/views/` | React pages and components. Consumes ViewModels only — never imports from `services/` directly. |

**Data flow:** View → ViewModel → Service → API

Constants live in `src/constants/`. Shared formatting helpers live in `src/utils/`.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your Weather AI API key:

   ```
   VITE_WAI_API_KEY=wai_your_actual_key
   ```

3. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (default: `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard — weather overview |
| `/farm` | Farm — canopy analysis |
