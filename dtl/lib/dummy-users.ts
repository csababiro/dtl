/**
 * Types for admin Utilizatori. Data from DB/API.
 */

export type DummyUserRole = "Super Admin" | "Admin" | "Staff";

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  /** When true, this Admin can add/edit/delete other admins and staff. Only for role "Admin". */
  canManageUsers?: boolean;
  /** Set when user completes invitation (set-password) flow. */
  passwordHash?: string;
  lastLogin?: string;
}
