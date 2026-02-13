# Lib structure

- **api/** – API client layer. Typed functions (`getClients`, `getAppointments`, `putFeatureFlags`, etc.) that call the HTTP API. Used by customer RSC, admin pages, and client components (or via hooks).
- **hooks/** – React hooks for admin client components (`useGallery`, `useTestimonials`, `useWorkingHours`, `useContactSettings`) that call the API services and manage loading/error state.
- **Other modules** – Shared utilities, types, and server-side stores used by `app/api` and server actions (e.g. feature-flags, settings, i18n, stores).
