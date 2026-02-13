# API documentation

This document is the source of truth for current and planned API behavior. It is intended to guide backend and frontend implementation. See also [openapi.yaml](openapi.yaml) for a machine-readable OpenAPI 3.x (Swagger) spec.

## Overview

- **Current state:** All admin and settings endpoints are implemented as Next.js API routes under `/api`, backed by existing in-memory or localStorage stores (no external DB yet). The client uses `lib/api-client.ts` to call either an external backend (`NEXT_PUBLIC_API_URL`) or the same-origin `/api`. Implemented areas: quote-requests, appointment-requests, push, feature-flags, business settings, working hours, contact, clients, plăți, client cars, appointments, gallery, testimonials, users.
- **Purpose:** Define existing contracts, data shapes, and planned behaviour (e.g. slot availability and the `showUnavailableSlots` feature flag) so APIs can be implemented consistently.
- **Cont (customer):** Endpoints for "my appointments", "my plăți", "my cereri" are currently served via server actions (no REST yet). Optional future: `GET /cont/appointments`, `GET /cont/plati` with session auth.

## Base URL and client

- **Base URL:** From `process.env.NEXT_PUBLIC_API_URL`. If unset or empty, the client falls back to same-origin `/api` (e.g. `window.location.origin + "/api"` or `NEXT_PUBLIC_APP_URL + "/api"`). Trailing slashes are stripped.
- **Client:** `lib/api-client.ts` exposes `get`, `post`, `put`, `patch`, `del`. All return `{ data: T }` on success or `{ error: ApiError }` on failure. Paths are appended to the base URL (leading slash is preserved).

## Existing routes

### Quote requests

- **GET** `/api/quote-requests` (or external `/quote-requests`)  
  Returns `{ items: QuoteRequest[] }`. Implemented in `app/api/quote-requests/route.ts`; uses in-memory store.
- **POST** `/api/quote-requests`  
  Body: `name`, `phone`, `email`, `carMake`, `carModel`, `carYear`, `description`; optional `chassis`, `photoUrl`.  
  Returns created `QuoteRequest` (201).

**QuoteRequest shape:** `id`, `createdAt`, `name`, `phone`, `email`, `carMake`, `carModel`, `carYear`, `description`, optional `chassis`, `photoUrl`, optional `status`. See `lib/quote-requests-store.ts`.

### Appointment requests

- **POST** `/api/appointment-requests` (or external equivalent)  
  Stub in `app/api/appointment-requests/route.ts`: accepts JSON body, returns 201 `{ id, status: "requested" }`; no persistence.  
  **Expected body (for implementation):** `name`, `phone`, `email`, car make/model/year, `description`, `date`, `time`, booking `type` (e.g. general / tyre / carWash).  
  **Expected response:** 201 with `{ id: string, status: string }`.

### Push

- **POST** `/api/push/register`  
  Body: `{ token: string, role?: "admin" | "user", ref?: string }`. For `role === "admin"` registers token as admin; for `role === "user"` requires `ref` and stores token by ref. Returns `{ ok: true }` or 400.
- **POST** `/api/push/notify-admin`  
  Body: `{ type?: string, name?: string, date?: string, time?: string }` (e.g. `type: "booking"`). Sends FCM to all registered admin tokens. Returns `{ ok: true, sent, failed }` or 503 if FCM not configured.
- **POST** `/api/push/notify-user`  
  Body: `{ ref: string, title?: string, body?: string }`. Sends FCM to the token stored for `ref`. Returns `{ ok: true, sent: 0|1 }` or 503.
- **GET** `/api/push/sw`  
  Serves the FCM service worker script with Firebase config injected. Response: JavaScript, `Cache-Control: no-store`.

Tokens are held in memory (`lib/push-tokens-store.ts`); no persistence.

## Settings and feature flags

### Feature flags

- **GET** `/settings/feature-flags`  
  Returns a JSON object that is merged with defaults in `lib/feature-flags.ts`. Used by `getFeatureFlags()`.

**Current flags (all optional booleans):**  
`tyreService`, `carWash`, `requestQuote`, `generalServiceBooking`, `tyreServiceBooking`, `carWashBooking`, `partsOrdering`, `cardInstallmentPayment`, `authentication`,  
`tyreServiceVisible`, `carWashVisible`, `requestQuoteVisible`, `generalServiceBookingVisible`, `tyreServiceBookingVisible`, `carWashBookingVisible`, `partsOrderingVisible`, `cardInstallmentPaymentVisible`, `authenticationVisible`,  
`showServicePrices`, `showTyreServicePrices`, `showCarWashPrices`,  
`gallery`, `testimonials`.

**New flag (to be added in code when implementing slots/UI):**

- **`showUnavailableSlots`** (boolean)  
  - When **`true`:** The programare (booking) UI must show time slots that are **unavailable** (e.g. already taken or blocked) to normal users, typically greyed out or non-selectable, so users can see why a time is not offered.  
  - When **`false`:** Only available slots are shown (current behaviour).  
  This flag will be added to the `FeatureFlags` interface and to `DEFAULT_FEATURE_FLAGS` in `lib/feature-flags.ts`; a helper such as `isShowUnavailableSlotsEnabled(flags)` can be added when implementing.

### Business settings

- **GET** `/settings/business`  
  Returns business settings (name, description, address, phone, email, whatsapp, logoUrl, hours). See `lib/settings.ts` and `lib/default-business-settings.json`.

## Slots / availability (to implement)

- **Working hours today:** Defined in `lib/working-hours.ts`. Per-day schedule Monday–Saturday (index 0–5); each day is either `{ start, end }` (HH:mm) or `{ closed: true }`. Stored in localStorage under `dtl-working-hours` when set from admin; no API yet.
- **Desired API contract for availability:**  
  Provide an endpoint that returns slots for a given day or range, e.g.  
  - `GET /slots?date=YYYY-MM-DD` or  
  - `GET /availability?from=YYYY-MM-DD&to=YYYY-MM-DD`,  
  returning a list of slots with at least `time` (e.g. "HH:mm") and `available` (boolean). Slots should respect working hours and existing appointments (or other blocking rules).
- **Requirement when `showUnavailableSlots` is true:** The response must include **both** available and unavailable slots for the requested day/range so the client can render unavailable slots as visible but not selectable for normal users.

## Other domains (no API yet)

- **Create-account interest:** `lib/create-account-interest.ts`; localStorage; records offer/response for “create account” prompt. Future endpoints TBD.

## Admin API (implemented)

The admin panel reads data via these API routes; mutations may use the same routes or server actions that call the same stores. All require admin authentication (session cookie; layout checks before rendering).

| Area | Endpoints | Response / body |
|------|-----------|-----------------|
| **Clients** | GET `/clients`, GET `/clients/{id}` | `{ items: Client[] }`, `Client`. |
| **Plăți** | GET `/clients/{id}/plati`, GET `/plati/{id}`, PATCH `/plati/{id}` (body: `notes`) | `{ items: ClientPlata[] }`, `ClientPlata`. |
| **Client cars** | GET `/clients/{id}/cars`, POST `/clients/{id}/cars`, PATCH `/clients/{id}/cars/{carId}`, DELETE `/clients/{id}/cars/{carId}` | `{ items: ClientCar[] }`, `ClientCar`. Body: `ClientCarCreate` / `ClientCarUpdate`. |
| **Users** | GET `/users`, POST `/users`, GET `/users/{id}`, PATCH `/users/{id}`, DELETE `/users/{id}` | `{ items: User[] }`, `User`. Body: `UserCreate` / `UserUpdate`. Invite/set-password remains server action. |
| **Appointments** | GET `/appointments`, GET `/appointments/{id}`, PATCH `/appointments/{id}`, DELETE `/appointments/{id}` | `{ items: Appointment[] }`, `Appointment`. Body: `AppointmentUpdate`. |
| **Quote requests** | GET `/quote-requests`, PATCH `/quote-requests/{id}` (body: `status`) | `{ items: QuoteRequest[] }`, `QuoteRequest`. |
| **Gallery** | GET `/gallery`, POST `/gallery` (body: `imageUrl` required, `title`/`caption` optional), DELETE `/gallery/{id}` | `{ items: GalleryItem[] }`, `GalleryItem`. |
| **Testimonials** | GET `/testimonials`, POST `/testimonials`, PATCH `/testimonials/{id}`, DELETE `/testimonials/{id}` | `{ items: TestimonialItem[] }`, `TestimonialItem`. |
| **Working hours (orar)** | GET `/settings/working-hours`, PUT `/settings/working-hours` | `WorkingHoursSchedule`. |
| **Contact settings** | GET `/settings/contact`, PUT `/settings/contact` | `ContactSettings`. |
| **Feature flags** | GET `/settings/feature-flags`, PUT `/settings/feature-flags` | `FeatureFlags`. |
| **Business settings** | GET `/settings/business`, PUT `/settings/business` | `BusinessSettings`. |

Push: admin uses POST `/push/register` with `role: "admin"` (existing). No additional admin-only push endpoints required.

## Data shapes (reference)

- **Client:** `DummyClient` in `lib/dummy-clients.ts`: `id`, `name`, `email`, `phone`, optional `car`, `programariCount`, optional `lastVisit`.
- **ClientPlata:** `ClientPlata` in `lib/dummy-plati.ts`: `id`, `clientId`, `nrFactura`, `data`, `suma`, `descriere`, optional `notes`.
- **ClientCar:** `ClientCar` in `lib/client-cars-store.ts`: `id`, `clientId`, `carMake`, `carModel`, `carYear`, optional `chassis`.
- **User:** `DummyUser` in `lib/dummy-users.ts`: `id`, `name`, `email`, `role` (Super Admin | Admin | Staff), `active`, optional `canManageUsers`, optional `lastLogin`.
- **Appointment:** `DummyAppointment` in `lib/dummy-appointments.ts`: `id`, `nume`, `telefon`, `email`, `data`, `ora`, `marca`, `model`, `tip` (general | tyre | carWash), `status` (Confirmat | În așteptare), optional `descriere`, optional `clientNotes`. Date format e.g. "d MMM yyyy"; time "HH:mm".
- **QuoteRequest:** See `lib/quote-requests-store.ts` (listed under Quote requests above).
- **Working hours:** `WorkingHoursSchedule` in `lib/working-hours.ts`: `days` array of 6 `DaySchedule` (Mon–Sat); each `DaySchedule` is `{ start, end }` or `{ closed: true }`.
- **Business settings:** `BusinessSettings` in `lib/settings.ts`: `name`, `description`, `address`, `phone`, `email`, `whatsapp`, `logoUrl`, `hours` (record of day labels to display string).
- **Contact settings:** `ContactSettings` in `lib/contact-settings.ts`: `companyName`, `phone`, `email`, `address`.
- **Gallery item:** `GalleryItem` in `lib/dummy-gallery.ts`: `id`, `title`, optional `caption`, `imageUrl`, `order`, `createdAt`. Create: `imageUrl` required (data URL or URL), `title`/`caption` optional.
- **Testimonial:** `TestimonialItem` in `lib/dummy-testimonials.ts`: `id`, `author`, optional `role`, `text`, optional `rating`, `createdAt`, `visible`.
