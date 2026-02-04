# Figma Make – Starting Design Prompt

Use this description with Figma Make (or similar AI design tools) to generate starting designs for the car service application.

---

## Prompt

**Project:** All-inclusive car service business application for the Romanian market. Two applications: (1) Customer-facing public website, (2) Admin dashboard for staff.

**Customer-facing app (mobile-first, responsive):**
- **Home page:** Hero section, service categories (General Service, Tyre, Car Wash), contact info (phone + email prominently displayed), address, embedded Google Map.
- **Services page:** List of services with prices and photos; option to request appointment.
- **Programare (Booking) page:** Form with fields: Name, Phone, Email, Car type (Make, Model, Year), Problem description (textbox), optional service list (checkboxes), Date & Time picker, optional photo upload. Booking window: 30 days in advance.
- **Contact page:** Phone, email, address, map. Phone and email must be always visible (e.g., sticky header or floating button).

**Admin app (mobile-responsive web):**
- **Dashboard:** Revenue and service volume (daily/weekly/monthly).
- **Staff calendar:** Day/Week/Month views; two modes – calendar grid view and form-based date/time selection. Separate calendars for General Service, Tyre, Car Wash. Appointments shown as Pending or Confirmed.
- **Appointment management:** List of requests; ability to modify slot, delete; click-to-call and click-to-SMS for contacting customers.
- **Business settings:** Contact info, address, operating hours, slot duration per service type, feature flags.
- **Service management:** General services, Tyre services, Car wash packages – each with pricing.
- **User management:** Staff roles (Super Admin, Admin, Technician), customer accounts.

**Style:** Clean, professional, mobile-first. Romanian language throughout. Include placeholder content in Romanian where applicable. Design should feel i18n-ready. Target: Next.js web app.

---

## Figma MCP Integration

**Design file (Figma Make):** [Car Service Application Design](https://www.figma.com/make/JcgKSBJg35eQwk1zig9H6e/Car-Service-Application-Design)

**File key:** `JcgKSBJg35eQwk1zig9H6e`  
**Node ID for Make files:** `0:0` (Make files use 0:0 as they have no traditional node IDs)

### What works with Figma Make

| Tool | Supported | Notes |
|------|-----------|-------|
| `get_design_context` | ✓ Yes | Returns design context (React-like code) and resource links for Make-generated source files. Use for design-to-code. |
| `get_screenshot` | ✗ No | Not supported for Make files |
| `get_metadata` | ✗ No | Not supported for Make files |

### Workflow for pixel-perfect implementation

1. **Use `get_design_context`** – Call with `fileKey: JcgKSBJg35eQwk1zig9H6e`, `nodeId: 0:0`. The response includes resource links for generated code (e.g., App.tsx). Use this as the design source for implementation.

2. **Optional: Publish to Figma Design** – If you need screenshots or metadata, publish/convert the Make draft to a regular Figma design file. Then `get_screenshot` and `get_metadata` will work for pixel-accurate inspection.

3. **Manual screenshots** – Export screens from Figma Make as PNG into a `design/` folder. The agent can read images for layout and style reference.

---

## Notes

- You can split this into separate prompts per screen or flow for more focused designs.
- Mockups for content/image layout will be added later (see Specs.md Section 5.2 – Content Management).
