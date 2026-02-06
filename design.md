# Design – Lightweight Reference

**Purpose:** Design principles, flows, screen map, and key UI decisions. For full behavior and field lists see [Specs.md](Specs.md); for screen-level detail see [design-preparation.md](design-preparation.md).

**Last updated:** February 2025

**Design reference:** Screen structure and routes follow the **`figma-src/`** folder (`app/pages/`, `app/components/`, `app/components/ui/`). **Site owner data** (contact, address, hours) for the main business is defined in [dtl-company-info.md](dtl-company-info.md); use it to populate the contact strip, map, footer, and Business Settings.

**Implementation specification:** Feature flags (tyre, car wash, quote; default ON), quote-request API endpoints, quote form fields/API, i18n key list, and component contracts are in [design-preparation.md](design-preparation.md) **§5**.

---

## 1. Design Principles

- **Web-first design that fits well on mobile** – Primary experience is desktop/web; layouts are designed for larger viewports first and must fit well on mobile (breakpoints sm 640px, md 768px, lg 1024px, xl 1280px). No horizontal scroll on small screens; touch targets ≥ 44×44px. Apply consistently across customer and admin apps.
- **Primary colour: blue** – Use **blue** as primary/accent (CTAs, primary buttons, links). Red only for errors or destructive actions.
- **Romanian only (v1)** – All copy in Romanian. Structure i18n-ready for future locales.
- **Guest-first, simple account** – Customers can submit appointment requests without an account. Accounts are simple: for appointment history and to receive promotional emails (Admins send; consent checkbox at sign-up, v1). Encourage sign-up; when they register with the same email, link past guest submissions.
- **Request-based booking** – Submissions are requests; staff confirm or adjust. No silent rejection.
- **Feature-flag driven** – Disabled modules/features are fully hidden (no “Coming soon”). Nav and content reflect flags. Required flags: **tyre**, **car wash**, **request quote** (Cerere ofertă); plus booking per type, parts ordering, card installment. **Default: all ON** when API unavailable. See [design-preparation.md](design-preparation.md) §5.1.
- **Errors: small lightweight popups** – Handle validation and API errors with small, lightweight popups (e.g. toast or compact modal). No heavy overlays; dismissible and non-blocking where appropriate.
- **Loading** – Use a clear, lightweight loading indicator (spinner or skeleton) for page load, form submit, and async data; avoid blank screens.

---

## 2. Main User Flows

| Flow | Steps |
|------|--------|
| **Guest booking** | Choose service type (General / Tyre / Wash per flags) → Fill form (name, phone, email, car, problem, optional services, date, time, optional photo) → Submit request → Email: “request received”. Later: staff confirm → Email: “appointment confirmed”. |
| **Customer sign-up** | Simple account: email+password, or phone+SMS, or Google SSO. Consent checkbox for promotional emails (Admins send; opt-in only). Purpose: history and promo emails. Guest submissions with same email are linked. |
| **Admin: request handling** | New request → Push + email to Admin → Open list/calendar → Contact customer (click-to-call/SMS) → Confirm (set slot) or modify or delete. |
| **Cerere ofertă** | Customer fills form (name, phone, email, car, description of need) at `/cere-oferta` → Submit quote request → Staff see at `/admin/quotes` → Contact customer (click-to-call/SMS/WhatsApp), respond with offer. No date/time. |
| **Admin: quote handling** | New quote request → Admin sees at `/admin/quotes` → Contact customer → Update or close request. |
| **Admin: daily ops** | Dashboard (revenue/volume), Calendar (Day/Week/Month, Pending/Confirmed), Appointments, Quotes, Business Settings, Feature Flags, Services, Users. Technician: calendar + mark job done only. |

---

## 3. Screen Map

**Customer-facing** (routes at root)

| Route | Purpose |
|-------|---------|
| `/` | Home: hero, service categories (by flags), contact strip, address, map (data from [dtl-company-info.md](dtl-company-info.md) when seeded) |
| `/servicii` | Services list with prices/photos; CTA “Request appointment” when booking on |
| `/programare` | Booking form; tabs by type (General / Tyre / Wash) when respective booking flag on |
| `/cere-oferta` | Cerere ofertă: request quote form (name, contact, car, description); when Request Quote Flag on |
| `/contact` | Phone, email, address, map; contact strip persistent |
| `/cont` | Authenticated: appointment history + invoices |

**Admin** (under `/admin`)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: revenue, service volume |
| `/admin/login` | Staff login (unauthenticated only) |
| `/admin/calendar` | Staff calendar (3 types, Day/Week/Month, Pending/Confirmed) |
| `/admin/appointments` | Request list; confirm, modify, delete; click-to-call/SMS |
| `/admin/quotes` | Quote requests (Cerere ofertă); list, contact customer, update/close |
| `/admin/settings` | Business: contact, address, hours, slot duration, Card Installment message |
| `/admin/feature-flags` | Super Admin: enable/disable; Admin: show/hide to customers |
| `/admin/services` | Service/pricing CRUD + optional booking lists (General, Tyre, Wash) |
| `/admin/content` | Image management for customer-facing app (gallery, service photos, branding) |
| `/admin/users` | Staff (Admin, Technician) and customer accounts |

---

## 4. Key UI Decisions

- **Top menu** – Single, straightforward top navigation: one level (Home, Servicii, Programare when booking enabled, Cerere ofertă when request-quote flag enabled, Contact, Cont). No deep nesting; contact strip (phone, email, optional WhatsApp) in header or adjacent. Contact and business data from Business Settings; default/seed from [dtl-company-info.md](dtl-company-info.md). Component props and behaviour: [design-preparation.md](design-preparation.md) §5.5.
- **Logo** – Business logo in header (left or centre), links to home. Configurable in Admin (Business Settings or Content).
- **Contact strip** – Phone and email **immediately visible**, high contrast, prominent and persistent (header or sticky). Optional **WhatsApp** icon/button when configured. Values from Business Settings. Props: [design-preparation.md](design-preparation.md) §5.5.
- **Primary CTA** – One highly visible “Programare” / “Rezervă” CTA on Home and Servicii; **one click** to start the booking flow.
- **Booking form (Programare)** – Single page with tabs for booking type (General / Tyre / Wash). Fields and behaviour as in [design-preparation.md](design-preparation.md) §1.3 (name, phone, email, car, problem, optional services, date, time slots, optional photo). **Date and time:** date picker + list of available slots; 30-day window.
- **Quote form (Cerere ofertă)** – Fields and API as in [design-preparation.md](design-preparation.md) §5.3. No date/time. Endpoints: [design-preparation.md](design-preparation.md) §5.2.
- **Map** – Google Maps, one component; address from settings. Shown on Home and Contact.
- **Calendar (admin)** – Default view: Week. Modes: calendar grid and form (date + time). Separate calendars per service type; slots from operating hours and restrictions.
- **Card Installment** – When flag on: show configurable message (no payment in app). Admin sets message/placement in Business Settings.
- **Images (admin)** – Admin manages photos for the customer-facing app (gallery, services, branding) from `/admin/content`. One place; images used on Home, Servicii, etc.
- **Errors** – Show validation and API errors in small, lightweight popups (e.g. toast or compact modal). Dismissible; avoid heavy full-page error screens.
- **Technician** – Same app, restricted nav: Calendar and “Mark job done” only.

---

## 5. Technical Foundation (per Specs §6.3)

Build first, then add screen content: **customer routes** (`/`, `/servicii`, `/programare`, `/cere-oferta`, `/contact`, `/cont`), **admin routes** (layout + login, dashboard, calendar, appointments, quotes, settings, feature-flags, services, content, users), **API client** (env base URL, typed errors), **feature flags** (tyre, car wash, request quote + others; default all ON; see [design-preparation.md](design-preparation.md) §5.1), **i18n** (Romanian; required keys in [design-preparation.md](design-preparation.md) §5.4), **root layout** (metadata, viewport, `lang="ro"`). Quote-request endpoints: [design-preparation.md](design-preparation.md) §5.2. Align screen structure with **`figma-src/`**; use **`dtl-company-info.md`** for default site owner data.

---

## 6. Consistency Checklist

- [ ] Foundation in place (routes, API client, feature flags, i18n, root layout).
- [ ] Viewport and `lang="ro"` in root layout.
- [ ] Contact strip and map use same data source (API/settings).
- [ ] Nav, Programare, and Cerere ofertă respect feature flags (disabled = hidden).
- [ ] Contact strip, map, and footer use Business Settings; seed/default from dtl-company-info.md.
- [ ] Booking form fields and validation align with Specs §8.2 and design-preparation §1.3; quote form and API with design-preparation §5.2–5.3.
- [ ] Errors surfaced via small lightweight popups (toast or compact modal).
- [ ] Customer account presented as simple (history + promo emails); no complex membership UX.
