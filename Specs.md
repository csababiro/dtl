# Comprehensive Specifications Document: All-Inclusive Car Service Business

**Document Version:** Refined v3 (February 2025)

This document outlines the functional and technical specifications for an all-inclusive car service business system. It incorporates refinements from stakeholder clarification sessions. **Backend/API specifications** will be developed separately after these general specs are finalized.

---

## 1. Introduction and Scope

### 1.1. Purpose

This document outlines the functional and technical specifications for developing an all-inclusive car service business system. The system will support three core business areas: General Vehicle Service and Maintenance, Car Tyre Sales and Fitting Services, and Car Wash Services.

### 1.2. Scope

The project scope includes the development of a unified management system comprising:
* **Single Next.js application** – Customer-facing pages (e.g., `/`, `/servicii`, `/programare`, `/cere-oferta`, `/contact`, `/cont`) and Admin pages under the **`/admin`** route (dashboard, calendar, appointments, quotes, settings, etc.).
* **Separate backend (API)** – Built as a distinct package/service within the project (monorepo). The frontend calls the API via a configurable base URL.
* **Capability** – The system must manage services for *every type of car*.

### 1.3. Key Features

* Comprehensive management of all three service areas.
* Centralized, administrator-controlled pricing and service catalog.
* Mobile-first, fully responsive administrative application.
* Scalable technology architecture.

### 1.4. Feature Flag Strategy

The system must utilize a robust feature flag mechanism to dynamically activate or deactivate major modules and critical sub-features. The core **General Vehicle Service and Maintenance** module is considered the baseline and is always active.

* **Primary Modules (Optional):** Car Wash Services, Car Tyre Sales and Fitting Services.
* **Module Sub-Features (Optional):** Car Parts Ordering, Booking Management for each module, **Card Installment Payment**, **Cerere ofertă** (Request quote).

**Feature Flag Control (Two-Tier):**

* **Super Admin:** Can enable or disable feature flags at the system level. When a flag is enabled, it becomes available for the business.
* **Admin:** Can show or hide features (that Super Admin has enabled) to customers. When Super Admin enables a flag, it is **visible by default** to Admin; Admin may then hide it if desired.
* **Module Visibility:** When a module or feature is disabled, it must be **completely hidden** from the customer-facing application (no "Coming soon" or placeholder content).
* **Requirement:** Changes to feature flags must be applied system-wide instantly.

---

## 2. General Vehicle Service and Maintenance (Core Module)

### 2.1. Scope

Covers standard vehicle upkeep, repair, and diagnostic services for all makes and models. This module is the primary, always-active core of the application.

### 2.2. Requirements

* **Service Catalog:** Must integrate with the Admin system to fetch the current list of general services and their prices.
* **Booking Management:** System must allow for scheduling service appointments, assigning technicians, and tracking vehicle status (e.g., *In Service*, *Awaiting Parts*, *Ready for Pickup*). This feature must be controlled by a dedicated **General Service Booking Flag**. Customer notification when vehicle status changes is **not required for now**.
  * **Customer-Facing Flow:** A structured process: **Customer Details** (Name, Email, Phone), **Car Details** (Make, Model, Year as free-text fields), **Service Description** (2–3 line textbox for customer to describe their problem), **Optional Service List** (business owner can configure a list; system must provide a default list of most common services), and **Preferred Date/Time** (customer selects from real available time slots).
  * **Request-Based Model:** Submissions are appointment *requests*; staff must review and resolve. See **Section 8.2** for full request-to-confirmation flow.
* **Parts Management & Ordering:** Ability to record and track parts used for each service job. A new feature for managing and ordering car parts must be included and controlled by a dedicated **Parts Ordering Flag**.
* **Customer Records:** Maintain a history of all services performed on a customer's specific vehicle.

---

## 3. Car Tyre Sales and Fitting Services (Optional Module)

### 3.1. Scope

Covers the sale, fitting, balancing, and related services for all vehicle tyres. This module's availability is controlled by a feature flag.

### 3.2. Requirements

* **Module Activation:** The entire module's functionality must be controlled by a dedicated **Tyre Service Flag**.
* **Service and Pricing:** Must integrate with the Admin system to dynamically fetch the types of tyre services offered (e.g., *Fitting*, *Balancing*, *Puncture Repair*) and their corresponding pricing.
* **Inventory Integration:** System should track tyre stock levels, including size, brand, and type (e.g., *Summer*, *Winter*, *All-Season*).
* **Booking Management:** Must allow for scheduling tyre service appointments. This feature must be controlled by a dedicated **Tyre Service Booking Flag**. Same customer-facing flow as General Service: Customer Info, Car Details, Service Description (textbox + optional service list), and selection from **real available time slots**. Same request-based flow (see **Section 8.2**).
* **Tire Specifics:** Ability to record tyre specifications used on a customer's vehicle.

---

## 4. Car Wash Services (Optional Module)

### 4.1. Scope

Covers the administration and tracking of various car wash and detailing packages. This module's availability is controlled by a feature flag.

### 4.2. Requirements

* **Module Activation:** The entire module's functionality must be controlled by a dedicated **Car Wash Flag**.
* **Service Packages:** Car wash packages (e.g., *Basic Wash*, *Premium Clean*, *Full Detail*) must be managed in a **separate Car Wash section** within the Admin system, not mixed with General Vehicle Services. Must fetch and display current packages and their prices.
* **Appointment-Based Booking:** Car wash uses the same appointment-based booking flow as General Service and Tyre Services. Customers reserve time slots. Controlled by a dedicated **Car Wash Booking Flag**. Same customer-facing flow: Customer Info, Car Details, Service Description (textbox + optional service list), and selection from real available slots. Same request-based flow (see **Section 8.2**).
* **Queue Tracking:** A simple mechanism for tracking vehicles in the car wash queue (operational tracking once appointments are confirmed).

---

## 5. Admin Web Application (Admin System)

### 5.1. Scope

The Admin Web Application is the primary control center for the business. It must be a single, fully **mobile-responsive web application**, accessible via any modern web browser on both desktop and mobile devices. Its key function is to manage all dynamic data and operational settings.

### 5.2. Key Features

* **Feature Flag Management:** See **Section 1.4** for two-tier control (Super Admin enables; Admin shows/hides).

* **Business Settings:**
  * **Contact Information:** Super Admin or Admin can configure the business **phone number** and **email** for display on the customer-facing application. Optionally, a **WhatsApp** number may be configured; when set, the customer-facing app and Admin contact actions (e.g. when staff contact customers) may offer WhatsApp (call or chat) alongside click-to-call and click-to-SMS.
  * **Logo:** Super Admin or Admin can configure the business **logo** for display in the customer-facing header (e.g. via Business Settings or Content/Images).
  * **Business Address:** Super Admin or Admin can configure the business **address**. Required for map display on the customer-facing application.
  * **Operating Hours:** Administrator can define and update operating hours (e.g., per day, with exceptions as needed). By default, available appointment slots are derived from operating hours. Admin can further **restrict availability** (e.g., block specific times, adjust available slots). **Romanian national holidays** are automatically included as exceptions (closed). Admin can add **extra off days or hours** (e.g., when a technician is not available).

* **Appointment Slot Configuration:**
  * **Separate calendars** for General Service, Tyre Service, and Car Wash (each has its own calendar and slot pool).
  * **Slot duration:** 1 hour by default for each service type. Business owner or Admin can **adjust slot duration separately** for General Service, Tyre Service, and Car Wash.

* **Staff Calendar:**
  * **Views:** Day, Week, Month. Default view is **Week**.
  * **Two interaction modes:** (1) **Calendar mode** – day/week/month grid view; (2) **Form mode** – date and time selection via form (date picker + time dropdown).

* **Vehicle Type Management:**
  * **Feature:** Administrator can create, update, and delete entries for supported car types/makes/models (for internal reference and catalog purposes).
  * **Note:** Customer appointment forms use **free-text fields** for Make, Model, and Year; predefined lists are not required for customer input.

* **Service and Pricing Management:**
  * **Feature:** Administrator can define and modify the list of all **General Vehicle Services** and set their specific pricing.
  * **Feature:** Administrator can define and modify the list of all **Car Tyre Services** (e.g., Fitting, Balancing) and set their specific pricing.
  * **Feature:** Administrator can define and modify **Car Wash packages** in a separate Car Wash section and set their pricing.
  * **Optional Service List (Booking):** Three **separate lists** – one for General Service, one for Tyre Service, one for Car Wash. Each list is linked to its respective service catalog and can be expanded by Admin. System must provide **default lists in Romanian**:
    * **General Service (default):** Schimb ulei, Revizie, Frâne, Filtre, Direcție, Diagnostic motor, Baterie, Climatizare, Rotație anvelope.
    * **Tyre Service (default):** Montaj anvelope, Echilibrare, Reparare pană, Schimb valve.
    * **Car Wash (default):** Spălare exterior, Spălare interior, Detaliu exterior, Detaliu complet.
  * **Requirement:** Pricing must be linked to the service catalog used by the entire system, only displaying options for currently active modules.

* **Content Management (Images):**
  * **Feature:** Business owner (Admin/Content Manager) can manage **photos** that appear on the customer-facing application (e.g., service images, gallery, branding). Mockups will be added to specify layout and usage.

* **User Management:**
  * **Feature:** Ability to manage staff accounts and roles.
  * **Required Roles:**
    * **Super Admin (Developer):** Highest-level access, capable of full system configuration and maintenance.
    * **Admin/Content Manager:** Role dedicated to adding/updating services, images, prices, and general content. Can show/hide features enabled by Super Admin.
    * **Technician:** Restricted role with limited access within the Admin app (e.g., view and update assigned jobs, vehicle status). Can be enabled/assigned by Admin or Super Admin from the Admin page.
    * **Normal User/Customer:** End-user role. Customers use **only** the customer-facing application; they do not log into the Admin system.
  * **Staff Account Creation:** Admin and Technician accounts are created by Super Admin or Admin.
  * **Customer Account Creation:** Both methods apply:
    * **Self-Registration:** Customers can create an account using one of: Email and Password; Phone Number (with SMS verification); Google Account (Single Sign-On/SSO).
    * **Staff-Created:** Admin or Super Admin can create customer accounts from the Admin system.

* **Reporting Dashboard:** Overview of daily/weekly/monthly revenue and service volume, only reflecting data from currently active modules.

* **Customer Contact (No Backend SMS):** For contacting customers about appointment requests, Admin uses **click-to-call**, **click-to-SMS**, and optionally **WhatsApp** (when configured) links from the Admin app. These open the device's phone dialer, SMS app, or WhatsApp with the customer's number pre-filled. No backend SMS integration; Admin sends messages directly from their phone.

* **Technician Interface:** Technicians log into the Admin application with a **restricted view** tailored to their role (e.g., assigned jobs, status updates). No separate Technician application.

* **Quote requests (Cerere ofertă):** When the Request Quote Flag is enabled, Admin has a **Quote requests** screen at `/admin/quotes`. Staff see a list of quote requests (customer name, contact, car, description, date submitted). Staff can contact the customer (click-to-call, click-to-SMS, optional WhatsApp) and update or close the request. New quote requests may trigger push and email notifications to Admins (same pattern as appointment requests).

---

## 6. Technology Stack

### 6.1. Application Development

The entire application (Admin System Web App and Customer-Facing Web App) will be implemented using **Next.js** with **React** and **TypeScript** for type safety and maintainability.

### 6.2. Requirements

* **Framework:** Next.js (App Router) with React and TypeScript.
* **Cross-Platform Compatibility/Responsiveness:** Both applications must be fully mobile-responsive and function seamlessly across desktop browsers and all major mobile device sizes (iOS and Android).
* **TypeScript Enforcement:** Development must enforce strict type checking using TypeScript to minimize runtime errors and improve code quality.
* **Rapid Prototyping:** Next.js supports an agile development process and rapid deployment of updates.
* **Backend Integration:** The Next.js app connects to the **separate backend API** via environment-configured base URL (e.g., `NEXT_PUBLIC_API_URL`). No hardcoded API URLs. Backend is a separate package in the monorepo; backend specs will be written separately.
* **Push Notifications (Admin):** Staff notifications for new appointment requests must use **Firebase Cloud Messaging (FCM)** for web push. The Admin app must support PWA (Progressive Web App) capabilities with a service worker to receive push notifications on web browsers (including mobile). This enables push notifications for Admin users on both desktop and mobile browsers.
* **Single Location:** The system is designed for a **single business location**; multi-branch support is out of scope.

* **Language:** The application is **Romanian only** for the initial release. The architecture must **allow for future multi-language support** (e.g., i18n-ready structure, externalized strings).

* **Environment Variables:** API base URL and other configuration must be provided via environment variables. Include `.env.example` with required variables (e.g., `NEXT_PUBLIC_API_URL`); never commit secrets to source control.

### 6.3. Implementation Foundation

The following must be in place first (routes, API client, feature flags, i18n, root layout). All other features build on this.

* **Customer routes (App Router):** `/` (Home), `/servicii` (Services), `/programare` (Booking), `/cere-oferta` (Cerere ofertă – request quote), `/contact` (Contact), `/cont` (Authenticated customer: appointment history and invoices). Implement as `app/page.tsx`, `app/servicii/page.tsx`, `app/programare/page.tsx`, `app/cere-oferta/page.tsx`, `app/contact/page.tsx`, `app/cont/page.tsx`.

* **Admin routes (under `/admin`):** Admin layout with auth guard (redirect unauthenticated to login), then: `/admin` (Dashboard), `/admin/login`, `/admin/calendar`, `/admin/appointments`, `/admin/quotes` (quote requests), `/admin/settings`, `/admin/feature-flags`, `/admin/services`, `/admin/content` (image management), `/admin/users`. Implement as `app/admin/layout.tsx` and `app/admin/.../page.tsx` per screen.

* **API client:** A single module (e.g. `lib/api-client.ts`) that performs all HTTP requests to the backend using `NEXT_PUBLIC_API_URL`. No hardcoded API URLs. Expose at least `get<T>(path)` and `post<T>(path, body)` returning `{ data: T } | { error: ApiError }`, with a typed **ApiError** (e.g. `kind: 'network' | 'http' | 'parse'`, `status?`, `message`, optional `retriable`).

* **Quote requests API (Cerere ofertă):** Backend must expose: **POST /quote-requests** (body: name, phone, email, carMake, carModel, carYear, description, photoUrl?); **GET /quote-requests** (returns `{ items: QuoteRequest[] }`); optional **PATCH /quote-requests/:id** (e.g. status). Full request/response shapes in [design-preparation.md](design-preparation.md) §5.2–5.3.

* **Feature flags:** A dedicated layer (e.g. `lib/feature-flags.ts`) that fetches flags from the API when available; until the API exists, use **default: all flags ON**. Required flags include **tyre**, **car wash**, **request quote** (Cerere ofertă); see [design-preparation.md](design-preparation.md) §5.1 for full list and keys. Expose async `getFeatureFlags()` and **sync helpers that take the flags object as first argument** (e.g. `isModuleEnabled(flags, 'tyre' | 'carWash')`, `isBookingEnabled(flags, 'general' | 'tyre' | 'carWash')`). Layout or page calls `getFeatureFlags()` then passes the result into these helpers; **do not use a global store** for flags. Layout and pages use this to hide nav, Programare tabs, and content when a flag is disabled (fully hidden, no placeholders). **Flag staleness:** When a flag is disabled by Admin, the customer sees the change after a **refresh**. If the customer submits a request (e.g. booking) without refreshing, the **API** must reject it; the application shows that error in a **lightweight popup**. The API is the **source of truth** for enforcing disabled features.

* **i18n (Romanian, v1):** Externalize all user-facing strings in a messages file (e.g. `messages/ro.json`) and expose a resolver (e.g. `t(key)` in `lib/i18n.ts`) for keys such as `nav.home`, `common.submit`. Use these strings in components; do not hardcode copy. Structure so additional locales can be added later.

* **Shared components:** Reusable UI (e.g. contact strip, map, booking form, service list) lives in a **`components/`** folder at the application root (e.g. `dtl/components/`), not under `app/`. Keep `app/` for routes and route-specific layout.

* **Stub auth (development):** When the backend is not available, the application may support **`NEXT_PUBLIC_MOCK_AUTH=true`** so staff can access admin routes for local development. Document this in `.env.example`; once the real backend and session exist, remove or ignore the mock.

* **Admin roles and nav:** The backend returns the user role with the session (e.g. JWT or `GET /me`). **Technician** users see in the admin nav only **Calendar** and **Mark job done**; Dashboard, Settings, Feature Flags, Appointments, Services, Content, and Users are hidden or restricted as specified. Admin and Super Admin see the full nav.

* **Root layout:** Set `lang="ro"` on `<html>`. Export metadata (title, description) and viewport (e.g. `viewport` export or in metadata). Optionally add a shared customer shell (e.g. header with contact strip, footer) in the root or a layout group.

* **Design reference:** Customer and admin screen structure and routes align with the **`figma-src/`** folder: `app/pages/` (Home, Services, Booking, RequestQuote, Contact, Account), `app/pages/admin/` (AdminLogin, Dashboard, AdminCalendar, Appointments, AdminQuotes, Settings, FeatureFlags, ServicesAdmin, ContentAdmin, UsersAdmin), `app/components/` (Header, Footer, ContactStrip, CustomerLayout, AdminLayout, AdminSidebar), `app/components/ui/` (shadcn-style primitives). Use as layout and copy reference; implement in Next.js App Router with i18n and dtl-company-info defaults.

* **Site owner data:** Main business data (name, description, address, phone, email, operating hours) for the site owner is defined in **`dtl-company-info.md`**. Use it to seed the application and Business Settings; contact strip, map, and footer use this data when the API is unavailable or as defaults.

---

## 7. Payment Information (System-Wide Feature)

### 7.1. Scope

Covers how payment-related information is presented to customers. **Payment is processed separately, outside the application** (e.g., in person at the service location). The application does not integrate with payment gateways or process transactions.

### 7.2. Requirements

* **No In-App Payment Processing:** The system does not process credit/debit card transactions. All payments are made separately (e.g., at the shop).
* **Card Installment Information:**
  * **Feature:** The application must inform customers that they **can pay by card in multiple installments** at the service location.
  * **Requirement:** The visibility of this information must be controlled by a dedicated **Card Installment Payment Flag**.
  * **Requirement:** Any messaging or display related to installment options must be configurable within the Admin System.

---

## 8. Customer-Facing Web Application

### 8.1. Scope

The customer-facing application provides a simple, responsive interface for customers to explore services, check operating hours, and request appointments.

### 8.2. Requirements

* **Contact Accessibility:** The service's **phone number** and **email** must be **immediately visible** (e.g. in the header or a sticky bar), with sufficient size and contrast so users see them without scrolling. They must be prominently and persistently displayed across all pages. These values are configured in **Business Settings**. Optionally, a **WhatsApp** number may be configured; when set, the application must offer **WhatsApp** (call or chat) alongside click-to-call (tel:) and click-to-SMS, e.g. as an icon or button next to the phone number.

* **Logo:** The customer-facing application must display the business **logo** in the header (e.g. left or centre). The logo links to the home page. The logo is configurable in Admin (Business Settings or Content/Images).

* **Primary colour and visual tone:** The application must use **blue** as the primary/accent colour (e.g. CTAs, primary buttons, key links). Red must not be used as the primary colour; red only for destructive actions or error states where appropriate.

* **Top navigation:** The customer-facing app must have a **single, straightforward top menu**: one level, no deep nesting. Typical items: Home, Servicii, Programare (when enabled), Cerere ofertă (when enabled), Contact, Cont. On small screens, a compact or hamburger menu is acceptable. Contact strip (phone, email, optional WhatsApp) sits in the header or immediately adjacent. Contact and business data (phone, email, address, hours) are configurable in Admin; default/seed values are in **`dtl-company-info.md`**.

* **Primary CTA – one-click programare:** A **single, highly visible** call-to-action for booking (e.g. “Programare” / “Rezervă programare”) must be present on the home page and, where relevant, on the services page. It must be **easy to see and one click away** from starting the booking flow (no extra landing step).

* **Business Address & Map:** The business **address** must be displayed, and a **map** (showing the business location) is required. Address is configured in Business Settings. **Map provider:** Google Maps.

* **Appointment Request Flow (Programare – when booking is active via feature flag):**

  **Form fields (required unless marked optional):**
  | Field | Required | Description |
  |-------|----------|-------------|
  | Name | ✓ | Customer name |
  | Phone | ✓ | Customer phone |
  | Email | ✓ | Customer email |
  | Car type | ✓ | Make, Model, Year (free text) |
  | Car problem | ✓ | Textbox for customer to describe the issue |
  | Optional service list | Optional | Selection from catalog (General/Tyre/Car Wash depending on booking type) |
  | Date | ✓ | Preferred date |
  | Time | ✓ | Preferred time (from available slots) |
  | Attach photo | Optional | Customer can attach a photo if needed (e.g., damage, issue) |
  * **Date and time selection – keep it simple:** Date and time must be selected in the **simplest possible way**: e.g. one step with date picker plus a **list of available time slots** (no free-text time). Prefer a **single, linear form**; avoid multi-step wizards unless necessary. The schedule (date + time) must be **obvious and easy** (e.g. calendar plus slot list in one view or one step).
  * **Booking Window:** Customers can book up to **30 days** in advance.
  * **Request-Based:** Submissions create appointment *requests*. Admin/business owner **contacts the customer** (e.g., by phone) to find a proper slot. Admin can **modify** the appointment with a new slot, or **delete** it if no solution is found. No silent rejection; resolution occurs through communication.
  * **Customer Notifications:**
    * Immediate email after submission: confirmation that the request has been received and will be reviewed by staff.
    * Email after staff confirms: final confirmation of the appointment.
  * **Staff Notifications:** When a new request is submitted, **Admins** receive a **push notification** (via Firebase) and an **email**. Notifications are always on; no opt-out.
  * **Staff Calendar:** Requests appear as **Pending** until staff action; after confirmation, they appear as **Confirmed**.

* **Guest Access:** Customers may submit appointment requests **without creating an account** (guest submission). When a guest later creates an account using the **same email**, their past guest submissions must be **linked** and visible in their appointment history.

* **Authenticated Customer Benefits:** When logged in, customers can view:
  * Past and upcoming appointments (requested, confirmed, completed).
  * Invoices and payment history: Business owner can add the **final price** to completed jobs; optionally can describe **items and quantities** separately. This data is entered manually by staff after payment (payment occurs outside the app).
  The application should encourage customers to create an account to access these benefits.

* **Simple Customer Account:** Customer accounts are simple: purpose is to have appointment history and to receive promotional emails. No complex membership or loyalty UX.

* **Promotional emails (v1):** **Admins** send promotional emails to customers. At sign-up, the customer must give **consent** via a **checkbox** (e.g. “Accept promotional emails”); only customers who opt in receive promo emails. In scope for v1.

* **Design and responsiveness:** The application must use **web-first design that fits well on mobile**: primary experience is desktop/web; layouts must work well on all screen sizes (fully responsive, no horizontal scroll on small screens, adequate touch targets on mobile).

* **Loading states:** The application must show a **clear, lightweight loading indicator** (e.g. spinner or skeleton) for: initial page load, form submission (e.g. programare), and any async data (services list, available slots). Avoid blank screens during loading; use a consistent, non-intrusive pattern.

* **Error display:** Validation and API errors must be shown in **small, lightweight popups** (e.g. toast or compact modal). Dismissible; avoid heavy full-page error screens. This includes when the API rejects a request (e.g. because a feature was disabled and the customer had not refreshed).

* **Cerere ofertă (Request quote):** When enabled by feature flag, the customer-facing app exposes a **Cerere ofertă** flow at `/cere-oferta`. Customers submit a **quote request** (not an appointment): name, phone, email, car details (make, model, year – free text), description of need or service interest, optional photo. Submissions create quote requests; staff review them in Admin at `/admin/quotes`, contact the customer (click-to-call, SMS, WhatsApp) and respond with an offer or follow-up. No date/time slot selection; this is for price or service inquiries. Customer may receive an email confirming the request was received. Admin may receive push/email notification for new quote requests (same pattern as appointment requests). Visibility of the Cerere ofertă nav item and page is controlled by a **Request Quote Flag** (Super Admin enables; Admin can show/hide to customers).

---

## Summary of Feature Flags

| Flag | Controlled By | Purpose |
|------|---------------|---------|
| Tyre Service Flag | Super Admin | Enable/disable entire Tyre module |
| Car Wash Flag | Super Admin | Enable/disable entire Car Wash module |
| General Service Booking Flag | Super Admin | Enable/disable General Service booking |
| Tyre Service Booking Flag | Super Admin | Enable/disable Tyre Service booking |
| Car Wash Booking Flag | Super Admin | Enable/disable Car Wash booking |
| Parts Ordering Flag | Super Admin | Enable/disable Parts Ordering |
| Card Installment Payment Flag | Super Admin | Show/hide installment payment information |
| Request Quote Flag | Super Admin | Enable/disable Cerere ofertă (request quote) flow; Admin can show/hide to customers |

Admin can show/hide enabled features to customers. When Super Admin enables a flag, it is visible by default to Admin.
