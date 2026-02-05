# Design – Lightweight Reference

**Purpose:** Design principles, flows, screen map, and key UI decisions. For full behavior and field lists see [Specs.md](Specs.md); for screen-level detail see [design-preparation.md](design-preparation.md).

**Last updated:** February 2025

---

## 1. Design Principles

- **Web-first design that fits well on mobile** – Primary experience is desktop/web; layouts are designed for larger viewports first and must fit well on mobile (breakpoints sm 640px, md 768px, lg 1024px, xl 1280px). No horizontal scroll on small screens; touch targets ≥ 44×44px. Apply consistently across customer and admin apps.
- **Romanian only (v1)** – All copy in Romanian. Structure i18n-ready for future locales.
- **Guest-first, simple account** – Customers can submit appointment requests without an account. Accounts are simple: for appointment history and to receive promotional emails (Admins send; consent checkbox at sign-up, v1). Encourage sign-up; when they register with the same email, link past guest submissions.
- **Request-based booking** – Submissions are requests; staff confirm or adjust. No silent rejection.
- **Feature-flag driven** – Disabled modules/features are fully hidden (no “Coming soon”). Nav and content reflect flags.
- **Errors: small lightweight popups** – Handle validation and API errors with small, lightweight popups (e.g. toast or compact modal). No heavy overlays; dismissible and non-blocking where appropriate.

---

## 2. Main User Flows

| Flow | Steps |
|------|--------|
| **Guest booking** | Choose service type (General / Tyre / Wash per flags) → Fill form (name, phone, email, car, problem, optional services, date, time, optional photo) → Submit request → Email: “request received”. Later: staff confirm → Email: “appointment confirmed”. |
| **Customer sign-up** | Simple account: email+password, or phone+SMS, or Google SSO. Consent checkbox for promotional emails (Admins send; opt-in only). Purpose: history and promo emails. Guest submissions with same email are linked. |
| **Admin: request handling** | New request → Push + email to Admin → Open list/calendar → Contact customer (click-to-call/SMS) → Confirm (set slot) or modify or delete. |
| **Admin: daily ops** | Dashboard (revenue/volume), Calendar (Day/Week/Month, Pending/Confirmed), Business Settings, Feature Flags, Services, Users. Technician: calendar + mark job done only. |

---

## 3. Screen Map

**Customer-facing** (routes at root)

| Route | Purpose |
|-------|---------|
| `/` | Home: hero, service categories (by flags), contact strip, address, map |
| `/servicii` | Services list with prices/photos; CTA “Request appointment” when booking on |
| `/programare` | Booking form; tabs by type (General / Tyre / Wash) when respective booking flag on |
| `/contact` | Phone, email, address, map; contact strip persistent |
| `/cont` | Authenticated: appointment history + invoices |

**Admin** (under `/admin`)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: revenue, service volume |
| `/admin/login` | Staff login (unauthenticated only) |
| `/admin/calendar` | Staff calendar (3 types, Day/Week/Month, Pending/Confirmed) |
| `/admin/appointments` | Request list; confirm, modify, delete; click-to-call/SMS |
| `/admin/settings` | Business: contact, address, hours, slot duration, Card Installment message |
| `/admin/feature-flags` | Super Admin: enable/disable; Admin: show/hide to customers |
| `/admin/services` | Service/pricing CRUD + optional booking lists (General, Tyre, Wash) |
| `/admin/content` | Image management for customer-facing app (gallery, service photos, branding) |
| `/admin/users` | Staff (Admin, Technician) and customer accounts |

---

## 4. Key UI Decisions

- **Contact strip** – Phone and email prominent and persistent (e.g. header or sticky) on all customer pages. Values from Business Settings.
- **Booking form** – Single page with tabs for booking type (General / Tyre / Wash). One form; type selects which catalog/slots apply. 30-day booking window; time from real available slots.
- **Map** – Google Maps, one component; address from settings. Shown on Home and Contact.
- **Calendar (admin)** – Default view: Week. Modes: calendar grid and form (date + time). Separate calendars per service type; slots from operating hours and restrictions.
- **Card Installment** – When flag on: show configurable message (no payment in app). Admin sets message/placement in Business Settings.
- **Images (admin)** – Admin manages photos for the customer-facing app (gallery, services, branding) from `/admin/content`. One place; images used on Home, Servicii, etc.
- **Errors** – Show validation and API errors in small, lightweight popups (e.g. toast or compact modal). Dismissible; avoid heavy full-page error screens.
- **Technician** – Same app, restricted nav: Calendar and “Mark job done” only.

---

## 5. Consistency Checklist

- [ ] Viewport and `lang="ro"` in root layout.
- [ ] Contact strip and map use same data source (API/settings).
- [ ] Nav and Programare tabs respect feature flags (disabled = hidden).
- [ ] Booking form fields and validation align with Specs §8.2 and design-preparation.
- [ ] Errors surfaced via small lightweight popups (toast or compact modal).
- [ ] Customer account presented as simple (history + promo emails); no complex membership UX.
