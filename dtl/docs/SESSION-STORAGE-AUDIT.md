# Session / Local Storage Audit – What Should Be in the DB

**Intent:** List everything stored in `sessionStorage` or `localStorage` and what should move to the database (or already has a DB and should be used instead).

**Verification:** After any migration, run `npm run typecheck` and test Cont, Programare, Cerere ofertă, Contact, and Admin (Orar, Calendar).

---

## 1. Customer session and profile (sessionStorage)

**Keys:** `dtl_customer_session`, `dtl_customer_name`, `dtl_customer_email`, `dtl_customer_phone`, `dtl_customer_cars`

**Where:**  
- **ContPageClient.tsx** – login/sign-up and “Cont” dashboard; reads/writes all of the above.  
- **BookingForm.tsx**, **CereOfertaForm.tsx**, **ContactForm.tsx** – read session + name/email/phone/cars to prefill forms when “logged in”.

**Current behavior:**  
- “Logged in” = `dtl_customer_session === "true"` (no server-side auth).  
- Name, email, phone are also saved in DB when the user signs up, books, or submits a quote (we now call `ensureClient` / `registerClient`).  
- Cars are **only** in sessionStorage; they are not persisted to the DB for the Cont “My cars” list.

**Should be in DB instead:**

| Data | Priority | Notes |
|------|----------|--------|
| **Customer identity / session** | Medium | Replace “session = true” with a real session (e.g. cookie + server session or JWT). Identify the client by `clientId` or email from DB. |
| **Name, email, phone** | Done | Already in `clients` when they register/book/quote. Forms can prefill from API by session (e.g. “get current client” endpoint) instead of sessionStorage. |
| **Customer cars (Cont “Mașinile mele”)** | High | `client_cars` table and API exist. Cont should load/save cars via `/api/clients/:id/cars` (and identify client by session), not `dtl_customer_cars` in sessionStorage. |

**Migration outline:**  
1. Introduce a proper customer session (e.g. login by email + magic link or password, set cookie/JWT, resolve to `clientId` on server).  
2. Cont dashboard: load profile (name, email, phone) and cars from API using session; save profile/cars via API.  
3. Booking/Cere ofertă/Contact: prefill from “current client” API when session exists; stop reading name/email/phone/cars from sessionStorage once session is DB-backed.

---

## 2. Sign-up prefill (sessionStorage)

**Key:** `dtl_signup_prefill`  
**Where:** CreateAccountPromptModal (writes); ContPageClient sign-up tab (reads once, then removes).

**Current behavior:** When the user clicks “Creează cont” from the prompt, we pass name/email/phone into the sign-up form via this key. Ephemeral.

**Should be in DB?** No. This is short-lived form prefill. Optional: pass via URL query or server action instead of storage; not required for DB.

---

## 3. Working hours (localStorage)

**Key:** `dtl-working-hours`  
**Where:** **lib/working-hours.ts** – `getWorkingHoursSchedule()`, `setWorkingHoursSchedule()`, `getMinMaxForDay()` read/write localStorage.

**Current behavior:**  
- Admin **Setări → Orar** saves via **API** → DB (`useWorkingHours` → `putWorkingHours` → `/api/settings/working-hours`).  
- Admin **Calendar** uses `getMinMaxForDay(date)` from **lib/working-hours**, which calls `getWorkingHoursSchedule()` and thus **reads from localStorage**, not from the API/DB.

**Should be in DB instead:**  
- **Yes.** Working hours are already stored in the DB when admin saves Orar.  
- **Fix:** Admin Calendar (and any other client that needs working hours) should get the schedule from the API (e.g. `getWorkingHours()` from `lib/api/settings` or a hook that fetches from API), not from `lib/working-hours`’s localStorage.  
- Then `getMinMaxForDay(day)` can take the schedule as an argument (from API) instead of reading localStorage; or the calendar page fetches working hours once and passes them in.

---

## 4. Contact settings (localStorage)

**Key:** `dtl-contact-settings`  
**Where:** **lib/contact-settings.ts** – `getContactSettings()`, `setContactSettings()` read/write localStorage.

**Current behavior:**  
- Admin and public API use **DB** for contact settings (`lib/services/contact-settings.ts` → `lib/db/contact-settings.ts`).  
- **lib/contact-settings.ts** (localStorage) is only imported for the **type** `ContactSettings` and possibly defaults; no component appears to call `getContactSettings()` or `setContactSettings()` from this file for reading/writing. So the **source of truth is already the DB**.

**Should be in DB instead:**  
- Already done for API/admin.  
- **Cleanup:** Ensure no client code uses `getContactSettings` / `setContactSettings` from `lib/contact-settings.ts` for persistence. If none, the localStorage logic in that file is legacy and can be removed or left as unused.

---

## 5. Create-account interest (localStorage)

**Key:** `dtl-create-account-interest`  
**Where:** **lib/create-account-interest.ts** – records when we show the “create account” prompt and whether the user clicked “Creează cont” or “Mai târziu”.

**Current behavior:** Used by CreateAccountPromptModal to record offer/response; data stays in browser only.

**Should be in DB instead:**  
- **Optional but useful.** Storing these events in the DB would allow analytics (e.g. how many users see the prompt after booking vs quote, how many click “create account” vs “later”).  
- Lower priority than customer session and cars; can be a later “analytics” or “prompt_events” table.

---

## 6. Summary table

| Storage key(s) | Location | In DB? | Action |
|----------------|----------|--------|--------|
| `dtl_customer_session`, name, email, phone | Cont, Booking, CereOferta, Contact | Profile: yes (clients). Session: no. | Replace session with DB-backed auth; prefill from API. |
| `dtl_customer_cars` | Cont, Booking, CereOferta | Yes (client_cars) | **Done:** Cont loads/saves cars via getClientWithCars + addClientCarAction/deleteClientCarAction; still syncs to sessionStorage for BookingForm prefill. |
| `dtl_signup_prefill` | CreateAccountPrompt, Cont | No | OK to keep as ephemeral prefill. |
| `dtl-working-hours` | lib/working-hours, Admin Calendar | Yes (API/Orar) | **Done:** Admin Calendar gets schedule from server (DB); getMinMaxForDay(day, schedule) accepts schedule from API. localStorage remains legacy fallback. |
| `dtl-contact-settings` | lib/contact-settings | Yes (API/admin use DB) | Confirm no client uses localStorage; remove or leave as dead. |
| `dtl-create-account-interest` | create-account-interest | No | **Low:** Optional DB table for analytics. |

---

## 7. Suggested order of work

1. **Working hours:** Make Admin Calendar (and any other consumer) get schedule from API; stop using localStorage in `getMinMaxForDay` / `getWorkingHoursSchedule()` for that flow.  
2. **Customer cars:** In Cont, load cars from API (by current client id/email from session) and save new/edited cars via API; remove persistence to `dtl_customer_cars`.  
3. **Customer session:** Introduce real auth (e.g. magic link or password for clients), store session in DB/cookie, resolve to client; then prefill name/email/phone/cars from “current client” API everywhere.  
4. **Create-account interest:** Optionally add DB table and record events server-side.
