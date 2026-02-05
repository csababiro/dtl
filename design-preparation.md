# Design Preparation for Implementation

**Purpose:** Consolidated design reference for implementation. Design will be generated from this document and Specs.

**Last updated:** February 2025

---

## 1. Customer-Facing App – Screens

### 1.1. Home
- **Header:** Logo (left or centre, links to home), straightforward top menu (Home, Servicii, Programare, Contact, Cont), contact strip – phone and email **immediately visible**, optional WhatsApp icon
- **Primary CTA:** One highly visible “Programare” / “Rezervă” button – one click to booking flow
- Hero section
- Service categories (General Service, Tyre, Car Wash – respect feature flags)
- Contact info: phone + email (prominent, sticky or header); optional WhatsApp
- Business address
- Embedded Google Map
- **Visual:** Primary colour blue (not red); loading indicator (spinner/skeleton) when needed

### 1.2. Services
- List of services with prices and photos
- Option to request appointment (when booking flag active)
- Content from Admin service catalog

### 1.3. Programare (Booking Form)
- **Keep schedule simple:** One step for date + time: date picker and **list of available slots** (no free-text time); single linear form
**Fields:**

| Field | Required | Type |
|-------|----------|------|
| Name | ✓ | Text input |
| Phone | ✓ | Tel input |
| Email | ✓ | Email input |
| Car type (Make, Model, Year) | ✓ | Free text |
| Car problem | ✓ | Textarea (2–3 lines) |
| Optional service list | Optional | Checkboxes from catalog |
| Date | ✓ | Date picker |
| Time | ✓ | Time slot selector |
| Attach photo | Optional | File upload |

- Booking window: 30 days ahead
- Submissions are requests (staff confirms)

### 1.4. Contact
- Phone, email, optional WhatsApp, address, map
- Phone and email **immediately visible** (sticky/floating), high contrast

### 1.5. Authenticated User (simple account)
- Purpose: appointment history and receiving promotional emails. No complex membership UX.
- Sign-up: include **consent checkbox** for promotional emails (Admins send; opt-in only). v1.
- Appointment history (requested, confirmed, completed)
- Invoices and payment history (final price, optional items/quantities)

---

## 2. Admin App – Screens

### 2.1. Dashboard
- Revenue and service volume (daily/weekly/monthly)

### 2.2. Staff Calendar
- **Views:** Day, Week (default), Month
- **Modes:** Calendar grid and form (date + time)
- **Calendars:** Separate for General Service, Tyre, Car Wash
- **States:** Pending, Confirmed

### 2.3. Appointment Management
- List of requests
- Modify slot, delete
- Click-to-call, click-to-SMS for customer contact

### 2.4. Business Settings
- Contact info (phone, email)
- Address
- Operating hours + Romanian holidays (auto) + extra off days/hours
- Slot duration per service type (default 1h each)

### 2.5. Service Management
- General services (with pricing)
- Tyre services (with pricing)
- Car wash packages (with pricing)
- Optional service lists for booking (3 lists, configurable)

### 2.6. User Management
- Staff roles: Super Admin, Admin, Technician
- Customer accounts (self-registration + staff-created)

### 2.7. Feature Flags
- Super Admin: enable/disable
- Admin: show/hide to customers

### 2.8. Content – Images
- Admin UI to manage photos for the customer-facing app (gallery, service images, branding).
- Images used on Home, Servicii, etc.; single source managed from admin.

### 2.9. Errors and feedback
- Validation and API errors: show in small, lightweight popups (toast or compact modal). Dismissible; avoid heavy full-page error screens.

---

## 3. Default Content (Romanian)

**General Service:** Schimb ulei, Revizie, Frâne, Filtre, Direcție, Diagnostic motor, Baterie, Climatizare, Rotație anvelope

**Tyre Service:** Montaj anvelope, Echilibrare, Reparare pană, Schimb valve

**Car Wash:** Spălare exterior, Spălare interior, Detaliu exterior, Detaliu complet

---

## 4. Tech Constraints

- **Framework:** Next.js (App Router) + React + TypeScript
- **App Structure:** Single Next.js app. Customer-facing routes at root (e.g., `/`, `/servicii`, `/programare`, `/contact`, `/cont`). Admin routes under `/admin` (e.g., `/admin`, `/admin/login`, `/admin/calendar`, `/admin/appointments`, `/admin/settings`, `/admin/feature-flags`, `/admin/services`, `/admin/content`, `/admin/users`).
- **Backend:** Separate API package in monorepo; frontend calls via `NEXT_PUBLIC_API_URL`.
- **Style:** Web-first design that fits well on mobile; responsive everywhere. **Primary colour: blue** (CTAs, primary buttons); red only for errors/destructive. **Loading:** lightweight spinner or skeleton for load and submit.
- **Language:** Romanian (i18n-ready)
- **Map:** Google Maps
- **Push:** Firebase Cloud Messaging (Admin PWA)

### 4.1. Implementation foundation (build first)

Implement in this order; everything else depends on it. See also Specs §6.3.

1. **Customer routes** – `/`, `/servicii`, `/programare`, `/contact`, `/cont` (placeholders OK initially).
2. **Admin routes** – `app/admin/layout.tsx` (auth guard + shell), then one `page.tsx` per admin screen (Dashboard, login, calendar, appointments, settings, feature-flags, services, content, users).
3. **API client** – Single module; all HTTP via `NEXT_PUBLIC_API_URL`; typed errors.
4. **Feature flags** – Dedicated layer; default all ON until API exists; used to hide nav and content when disabled.
5. **i18n** – Romanian strings externalized (e.g. `lib/i18n.ts` or `messages/ro.json`); use in layout and pages.
6. **Root layout** – `lang="ro"`, metadata, viewport; optional shared customer header/footer.

## 5. Environment

Copy `.env.example` to `.env` and fill in values. Required variables:
- `NEXT_PUBLIC_API_URL` – Backend API base URL (e.g., `http://localhost:3001`)

---

## 6. Implementation Checklist (When Ready)

- [ ] **Foundation (Specs §6.3):** Customer routes, admin route skeleton, API client, feature flags, i18n, root layout (metadata, viewport, `lang="ro"`).
- [ ] Implement customer app screens per this doc
- [ ] Implement admin app screens per this doc
- [ ] Align with Specs.md for behavior and data
- [ ] Configure `.env` from `.env.example`
