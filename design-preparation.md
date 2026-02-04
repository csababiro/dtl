# Design Preparation for Implementation

**Purpose:** Consolidated design reference for pixel-perfect implementation. Do not start code implementation until explicitly requested.

**Last updated:** February 2025

---

## 1. Design Source (Figma Make)

| Property | Value |
|----------|-------|
| **Figma Make file** | [Car Service Application Design](https://www.figma.com/make/JcgKSBJg35eQwk1zig9H6e/Car-Service-Application-Design) |
| **File key** | `JcgKSBJg35eQwk1zig9H6e` |
| **Node ID** | `0:0` (Make files) |

**To fetch design context:** Call Figma MCP `get_design_context` with the above fileKey and nodeId. The response contains resource links for Make-generated source files (start with App.tsx). Use this as the primary design reference for layout, components, and styling.

---

## 2. Customer-Facing App – Screens

### 2.1. Home
- Hero section
- Service categories (General Service, Tyre, Car Wash – respect feature flags)
- Contact info: phone + email (prominent, sticky or header)
- Business address
- Embedded Google Map

### 2.2. Services
- List of services with prices and photos
- Option to request appointment (when booking flag active)
- Content from Admin service catalog

### 2.3. Programare (Booking Form)
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

### 2.4. Contact
- Phone, email, address, map
- Phone and email always visible (sticky/floating)

### 2.5. Authenticated User
- Appointment history (requested, confirmed, completed)
- Invoices and payment history (final price, optional items/quantities)

---

## 3. Admin App – Screens

### 3.1. Dashboard
- Revenue and service volume (daily/weekly/monthly)

### 3.2. Staff Calendar
- **Views:** Day, Week (default), Month
- **Modes:** Calendar grid and form (date + time)
- **Calendars:** Separate for General Service, Tyre, Car Wash
- **States:** Pending, Confirmed

### 3.3. Appointment Management
- List of requests
- Modify slot, delete
- Click-to-call, click-to-SMS for customer contact

### 3.4. Business Settings
- Contact info (phone, email)
- Address
- Operating hours + Romanian holidays (auto) + extra off days/hours
- Slot duration per service type (default 1h each)

### 3.5. Service Management
- General services (with pricing)
- Tyre services (with pricing)
- Car wash packages (with pricing)
- Optional service lists for booking (3 lists, configurable)

### 3.6. User Management
- Staff roles: Super Admin, Admin, Technician
- Customer accounts (self-registration + staff-created)

### 3.7. Feature Flags
- Super Admin: enable/disable
- Admin: show/hide to customers

---

## 4. Default Content (Romanian)

**General Service:** Schimb ulei, Revizie, Frâne, Filtre, Direcție, Diagnostic motor, Baterie, Climatizare, Rotație anvelope

**Tyre Service:** Montaj anvelope, Echilibrare, Reparare pană, Schimb valve

**Car Wash:** Spălare exterior, Spălare interior, Detaliu exterior, Detaliu complet

---

## 5. Tech Constraints

- **Framework:** Next.js (App Router) + React + TypeScript
- **App Structure:** Single Next.js app. Customer-facing routes at root (e.g., `/`, `/servicii`, `/programare`, `/contact`). Admin routes under `/admin` (e.g., `/admin`, `/admin/calendar`, `/admin/settings`).
- **Backend:** Separate API package in monorepo; frontend calls via `NEXT_PUBLIC_API_URL`.
- **Style:** Mobile-first, responsive
- **Language:** Romanian (i18n-ready)
- **Map:** Google Maps
- **Push:** Firebase Cloud Messaging (Admin PWA)

## 6. Environment

Copy `.env.example` to `.env` and fill in values. Required variables:
- `NEXT_PUBLIC_API_URL` – Backend API base URL (e.g., `http://localhost:3001`)

---

## 7. Implementation Checklist (When Ready)

- [ ] Fetch design context from Figma Make (`get_design_context`)
- [ ] Extract/reuse components and styles from Make output
- [ ] Implement customer app screens per this doc
- [ ] Implement admin app screens per this doc
- [ ] Align with Specs.md for behavior and data
- [ ] Configure `.env` from `.env.example`
