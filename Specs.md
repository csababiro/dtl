# Comprehensive Specifications Document: All-Inclusive Car Service Business

**Document Version:** Refined (February 2025)

This document outlines the functional and technical specifications for an all-inclusive car service business system. It incorporates refinements from stakeholder clarification sessions.

---

## 1. Introduction and Scope

### 1.1. Purpose

This document outlines the functional and technical specifications for developing an all-inclusive car service business system. The system will support three core business areas: General Vehicle Service and Maintenance, Car Tyre Sales and Fitting Services, and Car Wash Services.

### 1.2. Scope

The project scope includes the development of a unified management system comprising a core platform, an Admin Web Application, and a Customer-Facing Web Application. The system must be capable of managing services for *every type of car*.

### 1.3. Key Features

* Comprehensive management of all three service areas.
* Centralized, administrator-controlled pricing and service catalog.
* Mobile-first, fully responsive administrative application.
* Scalable technology architecture.

### 1.4. Feature Flag Strategy

The system must utilize a robust feature flag mechanism to dynamically activate or deactivate major modules and critical sub-features. The core **General Vehicle Service and Maintenance** module is considered the baseline and is always active.

* **Primary Modules (Optional):** Car Wash Services, Car Tyre Sales and Fitting Services.
* **Module Sub-Features (Optional):** Car Parts Ordering, Booking Management for each module, **Card Installment Payment**.

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
* **Booking Management:** System must allow for scheduling service appointments, assigning technicians, and tracking vehicle status (e.g., *In Service*, *Awaiting Parts*, *Ready for Pickup*). This feature must be controlled by a dedicated **General Service Booking Flag**.
  * **Customer-Facing Flow:** A structured three-step process: **Customer Details** (Name, Email, Phone), **Car Details** (Make, Model, Year as free-text fields), and **Preferred Date/Time** (customer selects from real available time slots).
  * **Request-Based Model:** Submissions are appointment *requests*; staff must review and confirm or reject. See **Section 8.2** for full request-to-confirmation flow.
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
* **Booking Management:** Must allow for scheduling tyre service appointments. This feature must be controlled by a dedicated **Tyre Service Booking Flag**. The customer-facing flow must capture: Customer Info (Name, Email, Phone), Car Details (Make, Model, Year as free-text fields), and selection from **real available time slots**. Same request-based flow as General Service (see **Section 8.2**).
* **Tire Specifics:** Ability to record tyre specifications used on a customer's vehicle.

---

## 4. Car Wash Services (Optional Module)

### 4.1. Scope

Covers the administration and tracking of various car wash and detailing packages. This module's availability is controlled by a feature flag.

### 4.2. Requirements

* **Module Activation:** The entire module's functionality must be controlled by a dedicated **Car Wash Flag**.
* **Service Packages:** Car wash packages (e.g., *Basic Wash*, *Premium Clean*, *Full Detail*) must be managed in a **separate Car Wash section** within the Admin system, not mixed with General Vehicle Services. Must fetch and display current packages and their prices.
* **Appointment-Based Booking:** Car wash uses the same appointment-based booking flow as General Service and Tyre Services. Customers reserve time slots. Controlled by a dedicated **Car Wash Booking Flag**. Customer-facing flow: Customer Info, Car Details (free text), and selection from real available slots. Same request-based flow as General Service (see **Section 8.2**).
* **Queue Tracking:** A simple mechanism for tracking vehicles in the car wash queue (operational tracking once appointments are confirmed).

---

## 5. Admin Web Application (Admin System)

### 5.1. Scope

The Admin Web Application is the primary control center for the business. It must be a single, fully **mobile-responsive web application**, accessible via any modern web browser on both desktop and mobile devices. Its key function is to manage all dynamic data and operational settings.

### 5.2. Key Features

* **Feature Flag Management:** See **Section 1.4** for two-tier control (Super Admin enables; Admin shows/hides).

* **Business Settings:**
  * **Contact Information:** Administrator can configure the business **phone number** and **email** for display on the customer-facing application.
  * **Operating Hours:** Administrator can define and update operating hours (e.g., per day, with exceptions as needed).

* **Vehicle Type Management:**
  * **Feature:** Administrator can create, update, and delete entries for supported car types/makes/models (for internal reference and catalog purposes).
  * **Note:** Customer appointment forms use **free-text fields** for Make, Model, and Year; predefined lists are not required for customer input.

* **Service and Pricing Management:**
  * **Feature:** Administrator can define and modify the list of all **General Vehicle Services** and set their specific pricing.
  * **Feature:** Administrator can define and modify the list of all **Car Tyre Services** (e.g., Fitting, Balancing) and set their specific pricing.
  * **Feature:** Administrator can define and modify **Car Wash packages** in a separate Car Wash section and set their pricing.
  * **Requirement:** Pricing must be linked to the service catalog used by the entire system, only displaying options for currently active modules.

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

* **Technician Interface:** Technicians log into the Admin application with a **restricted view** tailored to their role (e.g., assigned jobs, status updates). No separate Technician application.

---

## 6. Technology Stack

### 6.1. Application Development

The entire application (Admin System Web App and Customer-Facing Web App) will be implemented using the **React** framework with **TypeScript** for type safety and maintainability.

### 6.2. Requirements

* **Cross-Platform Compatibility/Responsiveness:** Both applications must be fully mobile-responsive and function seamlessly across desktop browsers and all major mobile device sizes (iOS and Android).
* **TypeScript Enforcement:** Development must enforce strict type checking using TypeScript to minimize runtime errors and improve code quality.
* **Rapid Prototyping:** The choice of React is intended to support an agile development process and rapid deployment of updates.
* **Backend Integration:** Both applications must securely connect to the core backend system (API) to perform all tasks.
* **Single Location:** The system is designed for a **single business location**; multi-branch support is out of scope.

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

* **Contact Accessibility:** The service's **phone number** and **email** must be prominently and persistently displayed (e.g., in the header or a sticky button) across all pages. These values are configured in **Business Settings** within the Admin system.

* **Appointment Request Flow (when booking is active via feature flag):**
  * **Three-Step Process:** Customer Details (Name, Email, Phone), Car Details (Make, Model, Year as free text), and Preferred Date/Time (selection from **real available time slots**).
  * **Request-Based:** Submissions create appointment *requests*; staff must review and confirm or reject.
  * **Customer Notifications:**
    * Immediate email after submission: confirmation that the request has been received and will be reviewed by staff.
    * Email after staff confirms: final confirmation of the appointment.
  * **Staff Notifications:** When a new request is submitted, staff receive a **push notification** and an **email**.
  * **Staff Calendar:** Requests appear as **Pending** until staff action; after confirmation, they appear as **Confirmed**.

* **Guest Access:** Customers may submit appointment requests **without creating an account** (guest submission).

* **Authenticated Customer Benefits:** When logged in, customers can view:
  * Past and upcoming appointments (requested, confirmed, completed).
  * Payment history and invoices.
  The application should encourage customers to create an account to access these benefits.

* **Mobile-First Design:** The application must be fully mobile-responsive and optimized for simple navigation on small screens.

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

Admin can show/hide enabled features to customers. When Super Admin enables a flag, it is visible by default to Admin.
