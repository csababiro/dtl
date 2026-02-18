# Dummy / Hardcoded Data Audit

**Intent:** Identify all remaining dummy data, in-memory stores, and hardcoded values. All listed items have been fixed or removed.

**Verification:** `npx tsc --noEmit` (or `npm run build`).

---

## 1. UI fixes (done)

### 1.1 Admin Programări – fixed “today” date

- **Where:** `app/admin/(dashboard)/appointments/page.tsx`
- **Fix applied:** `referenceToday` is now `format(new Date(), "d MMM yyyy", { locale: enUS })` so “Viitoare” vs “Istoric” use the real current date.

### 1.2 Admin Conținut page – placeholder text

- **Where:** `app/admin/(dashboard)/content/page.tsx`
- **Fix applied:** Replaced “Conținut – placeholder.” with i18n key `admin.contentPageDesc`: “Pagini și texte pentru site (în curând).”

---

## 2. Dummy arrays and stores (removed)

All data now comes from the **database** via `lib/services` and `lib/db`.

| Location | Change |
|----------|--------|
| `lib/dummy-appointments.ts` | Removed `DUMMY_APPOINTMENTS`; kept types. |
| `lib/dummy-clients.ts` | Removed `DUMMY_CLIENTS`, `getClientById`, `getClientByEmail`; kept type. |
| `lib/dummy-plati.ts` | Removed `DUMMY_PLATI`, `getPlatiByClientId`; kept type. |
| `lib/dummy-users.ts` | Removed `DUMMY_USERS`; kept types. |
| `lib/dummy-gallery.ts` | Removed `DUMMY_GALLERY_ITEMS`; kept type. |
| `lib/dummy-testimonials.ts` | Removed `DUMMY_TESTIMONIAL_ITEMS`; kept type. |
| `lib/quote-requests-store.ts` | Removed store, `DUMMY_QUOTES`, seed; kept `QuoteRequest` type. |
| `lib/client-cars-store.ts` | Removed store, `DUMMY_CARS`, all functions; kept `ClientCar` type. |
| `lib/appointments-store.ts` | **Deleted.** |
| `lib/users-store.ts` | **Deleted.** |
| `lib/plati-store.ts` | **Deleted.** |
| `lib/gallery-server-store.ts` | **Deleted.** |
| `lib/testimonials-server-store.ts` | **Deleted.** |
| `lib/gallery-store.ts` | **Deleted.** |
| `lib/testimonials-store.ts` | **Deleted.** |

---

## 3. Config / defaults (unchanged)

- **`lib/contact-settings.ts`** – `DEFAULTS` (e.g. `companyName: "DTL Service"`). Contact/site data is read from DB; this file provides the type and defaults when nothing is in DB.
- **`NEXT_PUBLIC_MOCK_USER_ID`** – Used only for “current user” in dev; not dummy content.
