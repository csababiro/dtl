# Design Preparation for Implementation

**Purpose:** Consolidated design reference for implementation. Design will be generated from this document and Specs.

**Last updated:** February 2025

**Design reference:** Screen structure and routes align with the **`figma-src/`** folder: customer pages (Home, Services, Booking, RequestQuote at `/cere-oferta`, Contact, Account) in `app/pages/`, admin pages in `app/pages/admin/` (AdminLogin, Dashboard, AdminCalendar, Appointments, AdminQuotes, Settings, FeatureFlags, ServicesAdmin, ContentAdmin, UsersAdmin), shared components in `app/components/` (Header, Footer, ContactStrip, CustomerLayout, AdminLayout, AdminSidebar) and `app/components/ui/` for primitives.

**Site owner data:** Main business data (name, description, address, phone, email, operating hours) for populating the contact strip, map, footer, and Business Settings is defined in **`dtl-company-info.md`**. Use it as default/seed data and for design reference.

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

### 1.4. Cerere ofertă (Request quote)
- **Route:** `/cere-oferta`. Visibility controlled by Request Quote Flag.
- **Purpose:** Customer requests a price or service offer (no appointment slot).
- **Fields:** Name, Phone, Email (required); Car (Make, Model, Year – free text); Description of need or service interest (textarea); optional photo.
- **Flow:** Submit request → confirmation email (optional); staff see list at Admin → contact customer (click-to-call/SMS/WhatsApp), respond with offer.
- **No date/time** selection; distinct from Programare.

### 1.5. Contact
- Phone, email, optional WhatsApp, address, map
- Phone and email **immediately visible** (sticky/floating), high contrast

### 1.6. Authenticated User (simple account)
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

### 2.4. Quote Requests (Cerere ofertă)
- **Route:** `/admin/quotes`
- List of quote requests (customer, contact, car, description, date)
- Click-to-call, click-to-SMS, WhatsApp for customer contact
- Update or close request

### 2.5. Business Settings
- Contact info (phone, email)
- Address
- Operating hours + Romanian holidays (auto) + extra off days/hours
- Slot duration per service type (default 1h each)

### 2.6. Service Management
- General services (with pricing)
- Tyre services (with pricing)
- Car wash packages (with pricing)
- Optional service lists for booking (3 lists, configurable)

### 2.7. User Management
- Staff roles: Super Admin, Admin, Technician
- Customer accounts (self-registration + staff-created)

### 2.8. Feature Flags
- Super Admin: enable/disable
- Admin: show/hide to customers

### 2.9. Content – Images
- Admin UI to manage photos for the customer-facing app (gallery, service images, branding).
- Images used on Home, Servicii, etc.; single source managed from admin.

### 2.10. Errors and feedback
- Validation and API errors: show in small, lightweight popups (toast or compact modal). Dismissible; avoid heavy full-page error screens.

---

## 3. Default Content (Romanian)

**General Service:** Schimb ulei, Revizie, Frâne, Filtre, Direcție, Diagnostic motor, Baterie, Climatizare, Rotație anvelope

**Tyre Service:** Montaj anvelope, Echilibrare, Reparare pană, Schimb valve

**Car Wash:** Spălare exterior, Spălare interior, Detaliu exterior, Detaliu complet

---

## 4. Tech Constraints

- **Framework:** Next.js (App Router) + React + TypeScript
- **App Structure:** Single Next.js app. Customer-facing routes at root (e.g., `/`, `/servicii`, `/programare`, `/cere-oferta`, `/contact`, `/cont`). Admin routes under `/admin` (e.g., `/admin`, `/admin/login`, `/admin/calendar`, `/admin/appointments`, `/admin/quotes`, `/admin/settings`, `/admin/feature-flags`, `/admin/services`, `/admin/content`, `/admin/users`). Design reference: **`figma-src/`**. Default site owner data: **`dtl-company-info.md`**.
- **Backend:** Separate API package in monorepo; frontend calls via `NEXT_PUBLIC_API_URL`.
- **Style:** Web-first design that fits well on mobile; responsive everywhere. **Primary colour: blue** (CTAs, primary buttons); red only for errors/destructive. **Loading:** lightweight spinner or skeleton for load and submit.
- **Language:** Romanian (i18n-ready)
- **Map:** Google Maps
- **Push:** Firebase Cloud Messaging (Admin PWA)

### 4.1. Implementation foundation (build first)

Implement in this order; everything else depends on it. See also Specs §6.3.

1. **Customer routes** – `/`, `/servicii`, `/programare`, `/cere-oferta`, `/contact`, `/cont` (placeholders OK initially).
2. **Admin routes** – `app/admin/layout.tsx` (auth guard + shell), then one `page.tsx` per admin screen (Dashboard, login, calendar, appointments, **quotes**, settings, feature-flags, services, content, users).
3. **API client** – Single module; all HTTP via `NEXT_PUBLIC_API_URL`; typed errors.
4. **Feature flags** – Dedicated layer; **default all ON** until API exists; used to hide nav and content when disabled. See §5.1 for flag keys.
5. **i18n** – Romanian strings externalized (e.g. `lib/i18n.ts` or `messages/ro.json`); use in layout and pages. Required keys in §5.4.
6. **Root layout** – `lang="ro"`, metadata, viewport; optional shared customer header/footer.

---

## 5. Implementation specification

### 5.1. Feature flags

Flags needed for implementation. **Default: all ON** when API is unavailable or returns error.

| Key | Purpose | Default |
|-----|---------|--------|
| `tyreService` | Tyre module visible (services, nav) | ON |
| `carWash` | Car Wash module visible | ON |
| `requestQuote` | Cerere ofertă flow and nav item | ON |
| `generalServiceBooking` | General Service booking (Programare tab) | ON |
| `tyreServiceBooking` | Tyre Service booking tab | ON |
| `carWashBooking` | Car Wash booking tab | ON |
| `partsOrdering` | Parts ordering feature | ON |
| `cardInstallmentPayment` | Card installment message | ON |

Admin can show/hide enabled features to customers; use visibility overrides (e.g. `tyreServiceVisible`, `carWashVisible`, `requestQuoteVisible`) when provided by API. Sync helpers: e.g. `isModuleEnabled(flags, 'tyre' | 'carWash')`, `isRequestQuoteEnabled(flags)`, `isBookingEnabled(flags, 'general' | 'tyre' | 'carWash')`. Layout/pages pass the flags object into helpers; no global store.

### 5.2. API endpoints (quote requests)

Backend must expose:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/quote-requests` | Create a quote request. Body: see §5.3. Returns created resource or error. |
| `GET` | `/quote-requests` | List quote requests (admin). Returns `{ items: QuoteRequest[] }`. |
| `PATCH` | `/quote-requests/:id` | (Optional) Update status (e.g. close). Body: e.g. `{ status: string }`. |

**QuoteRequest** (response item): `id`, `createdAt`, `name`, `phone`, `email`, `carMake`, `carModel`, `carYear`, `description`, `photoUrl?`, `status?`.

### 5.3. Quote form (Cerere ofertă) – fields and API

Use this for **Cerere ofertă** only. **Booking form** stays as in §1.3 (Programare) with date, time slots, optional services, etc.

**Quote form fields:**

| Field | Required | Input type | i18n label key |
|-------|----------|------------|-----------------|
| Name | Yes | text | cereOferta.name |
| Phone | Yes | tel | cereOferta.phone |
| Email | Yes | email | cereOferta.email |
| Car Make | Yes | text | cereOferta.carMake |
| Car Model | Yes | text | cereOferta.carModel |
| Car Year | Yes | text | cereOferta.carYear |
| Description | Yes | textarea | cereOferta.description, cereOferta.descriptionPlaceholder |
| Photo | No | file | cereOferta.attachPhoto |

**POST /quote-requests body:** `{ name: string; phone: string; email: string; carMake: string; carModel: string; carYear: string; description: string; photoUrl?: string }`. Photo: upload separately if needed, then send `photoUrl`; or omit if not implemented.

Submit button: `t('cereOferta.submitRequest')`. Success: show `t('cereOferta.successMessage')`. Errors: show in lightweight popup (toast).

### 5.4. i18n – required keys (messages/ro.json)

Use dot notation (e.g. `nav.home`). Ensure these exist:

- **nav:** home, servicii, programare, cereOferta, contact, cont, login, logout
- **common:** submit, cancel, save, delete, edit, loading, error, close, back, next, previous, search, yes, no
- **home:** title, heroTitle, heroSubtitle, ctaProgramare, ctaRezerva, serviceGeneral, serviceTyre, serviceCarWash, address, contactUs
- **servicii:** title, requestAppointment, price, from, noServices
- **programare:** title, tabGeneral, tabTyre, tabCarWash, customerDetails, name, phone, email, carDetails, carMake, carModel, carYear, carProblem, carProblemPlaceholder, optionalServices, selectDate, selectTime, availableSlots, noSlots, attachPhoto, submitRequest, successMessage, bookingWindow
- **cereOferta:** title, name, phone, email, carMake, carModel, carYear, description, descriptionPlaceholder, attachPhoto, submitRequest, successMessage
- **contact:** title, phone, email, address, whatsapp, call, sms
- **cont:** title, signIn, signUp, appointmentHistory, invoices, promoConsent, requested, confirmed, completed, encourageAccount, noAppointments, noInvoices
- **admin:** title, dashboard, calendar, appointments, quotes, settings, featureFlags, services, content, users, markJobDone, loginTitle, email, password, loginSubmit, pending, confirmed, contactCustomer, noData, businessSettings, contactInfo, operatingHours, slotDuration, cardInstallmentMessage
- **errors:** network, featureDisabled, validation

### 5.5. Component contracts

Shared components receive data via props; no hardcoded copy (use `t()`).

- **ContactStrip** – Props: `phone?`, `email?`, `whatsapp?`. Render phone as `tel:`, email as `mailto:`, whatsapp as `https://wa.me/` (digits only). Min touch target 44px. Aria-labels from i18n (e.g. contact.call).
- **Header** – Props: `flags` (feature flags), `logoUrl?`, `phone?`, `email?`, `whatsapp?`. Logo links to `/`. Nav: Home, Servicii; Programare only if any booking enabled; **Cerere ofertă only if `isRequestQuoteEnabled(flags)`**; Contact, Cont. Include ContactStrip. Primary CTA: “Programare” to /programare when booking enabled. All labels from i18n.
- **Footer** – Props: `phone?`, `email?`, `whatsapp?`, `address?`. ContactStrip + address + links (Acasă, Servicii, Contact).
- **Map** – Props: `address?`, `className?`. Placeholder or Google Maps embed; address from settings.
- **LoadingSpinner** – No props. Accessible; aria-label from `t('common.loading')`.
- **ErrorToast** – Props: `message`, `onDismiss`. Dismissible compact bar; red/warning style.

---

## 6. Environment

Copy `.env.example` to `.env` and fill in values. Required variables:
- `NEXT_PUBLIC_API_URL` – Backend API base URL (e.g., `http://localhost:3001`)

---

## 7. Implementation Checklist (When Ready)

- [ ] **Foundation (Specs §6.3):** Customer routes, admin route skeleton, API client, feature flags, i18n, root layout (metadata, viewport, `lang="ro"`).
- [ ] Implement customer app screens per this doc
- [ ] Implement admin app screens per this doc
- [ ] Align with Specs.md for behavior and data
- [ ] Configure `.env` from `.env.example`
