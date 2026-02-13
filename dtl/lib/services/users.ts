import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import {
  getUsersFromDb,
  getUserByIdFromDb,
  getCurrentUserCanManageUsersFromDb,
  addUserInDb,
  updateUserInDb,
  deleteUserFromDb,
  setUserPasswordInDb,
} from "@/lib/db/users";
import { withDbErrorHandling } from "./errors";

export async function getUsers(): Promise<
  { data: DummyUser[] } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getUsersFromDb());
}

export async function getUserById(
  id: string
): Promise<{ data: DummyUser | null } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => getUserByIdFromDb(id));
}

export async function getCurrentUserCanManageUsers(): Promise<
  { data: boolean } | { error: import("./errors").ServiceError }
> {
  return withDbErrorHandling(() => getCurrentUserCanManageUsersFromDb());
}

export async function addUser(data: {
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  canManageUsers?: boolean;
}): Promise<{ data: DummyUser } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => addUserInDb(data));
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: DummyUserRole;
    active: boolean;
    canManageUsers: boolean;
  }>
): Promise<{ data: DummyUser | null } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => updateUserInDb(id, data));
}

export async function deleteUser(
  id: string
): Promise<{ data: boolean } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => deleteUserFromDb(id));
}

export async function setUserPassword(
  id: string,
  passwordHash: string
): Promise<{ data: DummyUser | null } | { error: import("./errors").ServiceError }> {
  return withDbErrorHandling(() => setUserPasswordInDb(id, passwordHash));
}
