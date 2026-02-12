# API documentation

This document is the source of truth for current and planned API behavior. It is intended to guide backend and frontend implementation. See also [openapi.yaml](openapi.yaml) for a machine-readable OpenAPI 3.x (Swagger) spec.

## Overview

- **Current state:** Some routes live under the Next.js app at `/api` (quote-requests, appointment-requests, push). The client uses `lib/api-client.ts` to call either an external backend (`NEXT_PUBLIC_API_URL`) or the same-origin `/api`. Settings and feature flags are expected from the API; many other domains (appointments, working hours, gallery, testimonials, contact, create-account interest) are still store-only or localStorage/in-memory with no API yet.
- **Purpose:** Define existing contracts, data shapes, and planned behaviour (e.g. slot availability and the `showUnavailableSlots` feature flag) so APIs can be implemented consistently.

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

## Admin API (planned)

The admin panel currently uses in-memory stores and localStorage. When a real backend is used, the following endpoints are needed so the admin UI can list, create, update, and delete data. All require admin authentication (to be defined; e.g. session cookie or Bearer token).

| Area | Endpoints | Notes |
|------|-----------|--------|
| **Appointments** | GET `/appointments`, GET `/appointments/{id}`, PATCH `/appointments/{id}` (status and/or date/time), DELETE `/appointments/{id}` | Today: `lib/appointments-store.ts` (in-memory). |
| **Quote requests** | GET `/quote-requests` (existing), PATCH `/quote-requests/{id}` (e.g. `status: "prepared"`) | Today: store + server action. |
| **Gallery** | GET `/gallery`, POST `/gallery`, DELETE `/gallery/{id}` | Today: `lib/gallery-store.ts` (localStorage). |
| **Testimonials** | GET `/testimonials`, POST `/testimonials`, PATCH `/testimonials/{id}`, DELETE `/testimonials/{id}` | Today: `lib/testimonials-store.ts` (localStorage). |
| **Working hours (orar)** | GET `/settings/working-hours`, PUT `/settings/working-hours` | Today: `lib/working-hours.ts` (localStorage). Body: `WorkingHoursSchedule`. |
| **Contact settings** | GET `/settings/contact`, PUT `/settings/contact` | Today: `lib/contact-settings.ts` (localStorage). Body: `ContactSettings`. |
| **Feature flags** | GET `/settings/feature-flags` (existing), PUT `/settings/feature-flags` | Admin toggles; body: partial `FeatureFlags`. |
| **Business settings** | GET `/settings/business` (existing), PUT `/settings/business` | Body: partial `BusinessSettings`. |

Push: admin uses POST `/push/register` with `role: "admin"` (existing). No additional admin-only push endpoints required.

## Data shapes (reference)

- **Appointment:** `DummyAppointment` in `lib/dummy-appointments.ts`: `id`, `nume`, `telefon`, `email`, `data`, `ora`, `marca`, `model`, `tip` (general | tyre | carWash), `status` (Confirmat | În așteptare), optional `descriere`. Date format e.g. "d MMM yyyy"; time "HH:mm".
- **QuoteRequest:** See `lib/quote-requests-store.ts` (listed under Quote requests above).
- **Working hours:** `WorkingHoursSchedule` in `lib/working-hours.ts`: `days` array of 6 `DaySchedule` (Mon–Sat); each `DaySchedule` is `{ start, end }` or `{ closed: true }`.
- **Business settings:** `BusinessSettings` in `lib/settings.ts`: `name`, `description`, `address`, `phone`, `email`, `whatsapp`, `logoUrl`, `hours` (record of day labels to display string).
- **Contact settings:** `ContactSettings` in `lib/contact-settings.ts`: `companyName`, `phone`, `email`, `address`.
- **Gallery item:** `GalleryItem` in `lib/dummy-gallery.ts`: `id`, `title`, optional `caption`, `imageUrl`, `order`, `createdAt`.
- **Testimonial:** `TestimonialItem` in `lib/dummy-testimonials.ts`: `id`, `author`, optional `role`, `text`, optional `rating`, `createdAt`, `visible`.
