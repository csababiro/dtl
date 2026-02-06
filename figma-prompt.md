# Figma Design Prompt: DTL – All Screens for Car Service Web App

Create a complete set of UI screens for a **Romanian, mobile-first car service web app** (Next.js). One design system; two areas: **customer-facing** and **admin**. All copy in **Romanian**. **Site owner data** (business name, address, phone, hours) for contact strip, map, and footer: use **`dtl-company-info.md`** as reference (e.g. DTL service-vulcanizare-spalatorie, Strada Principală 446, Sîntandrei, +40 744 927 038, Mon–Fri 8–17, Sat 8–13:30, Sun closed).

---

## Where to paste this in Figma (Figma AI / Figma Make)

### Option A: Figma Make (official “prompt to app” AI)

Figma Make turns prompts into **functional prototypes or web apps**. You paste your prompt into the **AI chat** in a Make file.

**Steps:**

1. **Open or create a Figma Make file**
   - In the file browser (e.g. Drafts), click **Make** in the upper-right (or use the menu to create a new **Make** file).
   - If you don’t see “Make”, check your plan: Make is on paid plans (Full seats); some plans offer limited tries.

2. **Find the AI chat**
   - The Make canvas has two main areas: **AI chat** (usually left or bottom) and **preview** (right or top).
   - The **prompt box** is inside that AI chat panel—it’s the text field where you type or paste.

3. **Paste the prompt**
   - Open `figma-prompt.md`, copy the full content (or the sections you need).
   - Click inside the **AI chat / prompt box** in Figma Make.
   - Paste (Ctrl+V / Cmd+V) and press Enter (or click Send).

4. **Iterate**
   - You can add more messages (e.g. “generate only the customer screens first” or “add a mobile frame for Home”).
   - To get **design layers** (not only the live preview): use **Copy preview as design layers** and paste into a normal **Figma Design** file to get editable frames.

**Tip:** If the full prompt is too long, paste in parts (e.g. “Design System + Shared Components”, then “Customer screens 1–3”, then “Admin screens 7–15”).

---

### Option B: Figma Design + AI plugins

If you’re in **Figma Design** (normal design file) and using a **plugin** that accepts text prompts (e.g. Magician, Uizard, FigPilot, or similar):

1. Open your **Figma Design** file and the **Plugins** menu (e.g. right-click canvas → Plugins, or Resources → Plugins).
2. Run the AI plugin that supports “generate from description” or “text to design”.
3. In the plugin’s **text / prompt input**, paste the relevant part of this document (e.g. one screen description, or Design System + one screen).
4. Generate, then refine in the canvas. Repeat for other screens.

---

### Option C: Manual design with this as a brief

Use this file as a **design brief**: keep it open (or in a doc) and build screens yourself (or with a designer) by following each section. No pasting into AI needed; the structure and copy reference are for consistency.

---

## Prompt (use from here down in the AI chat or plugin)

---

## Design System

- **Primary colour:** blue (CTAs, primary buttons, main links). Do **not** use red as primary; red only for errors or destructive actions.
- **Typography:** Clear, readable; support Romanian (e.g. ș, ț, ă, â, î).
- **Responsiveness:** Web-first, then adapt to mobile. Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px. No horizontal scroll on small screens; touch targets at least 44×44px.
- **Loading:** Use a single, lightweight pattern (e.g. spinner or skeleton) for page load, form submit, and async data.
- **Errors:** Show validation/API errors in small, dismissible popups (toast or compact modal), not full-page error screens.

---

## Shared Customer Components (reuse across customer screens)

- **Header:** Logo (left or centre, links to home); **contact strip** with phone and email **always visible** (high contrast); optional WhatsApp icon when configured; top nav: Acasă, Servicii, Programare, Cerere ofertă (when enabled), Contact, Cont. One level only; on mobile use a compact or hamburger menu. Primary CTA: “Programare” / “Rezervă programare” (blue button).
- **Footer:** Same contact strip (phone, email, optional WhatsApp), business address, small links (Acasă, Servicii, Contact).
- **Map:** One reusable block for “business location” (placeholder or simple map style); used on Home and Contact.

---

## Customer-Facing Screens

### 1. Home (/)
Hero (title e.g. “Servicii auto complete”, short subtitle); one prominent CTA: “Rezervă programare” → booking. Service categories (only if active): Service general, Anvelope, Spălătorie. Contact strip + address + map. Blue as accent.

### 2. Servicii (/servicii)
List of services with name, price (“Preț”, “de la X RON”), optional image. Per section: Service general, Anvelope, Spălătorie (sections shown only if module is active). One CTA: “Solicită programare” when booking is on.

### 3. Programare (/programare)
Single booking form (one page). Tabs at top: “Service general” / “Anvelope” / “Spălătorie” (only show tabs for active booking types). Fields: Nume, Telefon, Email (required); Marca, Model, An (free text); “Descriere problemă” (textarea 2–3 lines); optional “Servicii opționale” (checkboxes from list); “Data preferată” (date picker); “Ora preferată” (list of time slots, no free text); optional “Atașează poză”. One step: date + list of slots together. Helper text: “Poți programa cu maximum 30 zile în avans.” Submit: “Trimite cererea.” Success state: short message “Cererea a fost primită…”.

### 4. Cerere ofertă (/cere-oferta)
Request quote form (no appointment slot). When Request Quote Flag on. Fields: Nume, Telefon, Email (required); Marca, Model, An (free text); "Descriere nevoie / serviciu" (textarea). Optional "Atașează poză". Submit: "Trimite cererea de ofertă." Success: "Cererea a fost primită. Veți fi contactat." No date/time. Staff manage at /admin/quotes.

### 5. Contact (/contact)
Phone, email, optional WhatsApp, address; all prominent. Same map component. Contact strip in header/footer.

### 6. Cont (/cont) – not logged in
Title “Contul meu”. Short text encouraging account (istoric programări, facturi). Buttons/links: “Autentificare”, “Înregistrare”. Checkbox: “Accept să primesc oferte și noutăți pe email”.

### 7. Cont (/cont) – logged in
Same header/footer. Sections: “Istoric programări” (list: requested / confirmed / completed); “Facturi și plăți” (list: final price, optional items). Simple, no complex membership UI.

---

## Admin Screens (under /admin)

Visual style: neutral (e.g. grey/white), blue for primary actions. Sidebar or top nav for all admin pages.

### 7. Admin Login (/admin/login)
Centred card: title “Autentificare staff”, Email, Parolă, button “Intră”. Small note about dev/mock auth optional.

### 8. Dashboard (/admin)
Title “Panou”. Cards or table: Venit (azi / săptămâna aceasta / luna aceasta), Volum servicii (same periods). Only for active modules.

### 9. Calendar (/admin/calendar)
Title “Calendar”. View switcher: Zi | Săptămână (default) | Lună. Optional toggle: grid vs form (dată + oră). Tabs or selector: Service general / Anvelope / Spălătorie (separate calendars). Entries in two states: “În așteptare”, “Confirmat”. One week grid wireframe is enough.

### 10. Appointments (/admin/appointments)
Title “Programări”. Table: Data, Client, Tip, Status, Acțiuni. Acțiuni: Confirmă, Modifică, Șterge; contact: click-to-call, click-to-SMS, WhatsApp (icons/links). No in-app SMS; links open device dialer/SMS/WhatsApp.

### 11. Quote Requests (/admin/quotes)
Title "Cereri ofertă". Table: Data, Client, Contact, Mașină, Descriere, Acțiuni. Contact customer (click-to-call, SMS, WhatsApp); update or close request.

### 12. Settings (/admin/settings)
Title “Setări”. Sections: Contact (telefon, email, WhatsApp opțional); Logo; Adresă; Program (per zi + excepții); Durată slot (per tip serviciu, default 1h); Mesaj plăți rate (când e activ).

### 13. Feature Flags (/admin/feature-flags)
Title “Feature flags”. List of flags with two controls each: “Activ (Super Admin)” on/off, “Vizibil clienți (Admin)” on/off. Labels: Modul Anvelope, Modul Spălătorie, Programare Service general, Programare Anvelope, Programare Spălătorie, Cerere ofertă, Comandă piese, Info plăți în rate.

### 14. Services (/admin/services)
Title “Servicii”. Three sections: Service general (list + preț), Anvelope (list + preț), Spălătorie (list + preț). Per section: add/edit/delete; optional “Listă servicii opționale pentru programare” (default list in Romanian).

### 15. Content (/admin/content)
Title “Conținut”. Image management: upload, reorder, delete. Used for galerie, imagini servicii, branding pe site-ul client.

### 16. Users (/admin/users)
Title “Utilizatori”. Two parts: Staff (Super Admin, Admin, Technician – create/edit); Clienți (list, create from admin). Roles and permissions as in specs.

---

## Optional

- **Technician view:** Same admin shell but nav only: Calendar + “Marchează lucrarea făcută”. One frame showing this reduced nav is enough.
- **Empty states:** For lists (servicii, programări, facturi) show a simple “Nu există date” / “Nu ai programări” style state.
- **Mobile:** One key frame per screen at ~375px width (or one responsive frame) so layout and touch targets are clear.

---

## Copy Reference (Romanian)

- **Nav:** Acasă, Servicii, Programare, Contact, Cont.
- **Programare:** Nume, Telefon, Email, Marca, Model, An, Descriere problemă, Servicii opționale, Data preferată, Ora preferată, Atașează poză, Trimite cererea.
- **Status:** Solicitat, Confirmat, Finalizat.
- **Admin:** Panou, Calendar, Programări, Setări, Feature flags, Servicii, Conținut, Utilizatori, Autentificare staff.

Use this prompt in Figma (e.g. as a design brief or with Figma AI) to generate all screens and keep them consistent with the product.
