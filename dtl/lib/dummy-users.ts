/**
 * Dummy user data for admin Utilizatori (no API yet).
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

export const DUMMY_USERS: DummyUser[] = [
  {
    id: "u1",
    name: "Admin DTL",
    email: "admin@dtl.ro",
    role: "Super Admin",
    active: true,
    lastLogin: "2025-02-12T08:30:00.000Z",
  },
  {
    id: "u2",
    name: "Maria Ionescu",
    email: "maria.ionescu@dtl.ro",
    role: "Admin",
    active: true,
    canManageUsers: true,
    lastLogin: "2025-02-12T09:15:00.000Z",
  },
  {
    id: "u3",
    name: "Ion Popescu",
    email: "ion.popescu@dtl.ro",
    role: "Admin",
    active: true,
    canManageUsers: false,
    lastLogin: "2025-02-11T16:45:00.000Z",
  },
  {
    id: "u4",
    name: "Elena Stan",
    email: "elena.stan@dtl.ro",
    role: "Staff",
    active: true,
    lastLogin: "2025-02-12T07:00:00.000Z",
  },
  {
    id: "u5",
    name: "Andrei Marin",
    email: "andrei.marin@dtl.ro",
    role: "Staff",
    active: true,
    lastLogin: "2025-02-10T14:20:00.000Z",
  },
  {
    id: "u6",
    name: "Cristina Radu",
    email: "cristina.radu@dtl.ro",
    role: "Staff",
    active: false,
    lastLogin: "2025-01-28T11:00:00.000Z",
  },
];
