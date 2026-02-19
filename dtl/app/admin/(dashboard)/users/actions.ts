"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  setUserPassword,
} from "@/lib/services";
import { canAuthManageUsers } from "@/lib/db/users";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload) return null;
  const allowed = await canAuthManageUsers(payload);
  if (!allowed) return null;
  return payload;
}

export async function getUsersAction(): Promise<
  { data: DummyUser[] } | { error: string }
> {
  const auth = await requireAuth();
  if (!auth) return { error: "Unauthorized" };
  const result = await getUsers();
  if ("error" in result) return { error: result.error.message };
  return { data: result.data };
}

type CreateUserInput = {
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  canManageUsers?: boolean;
  password?: string;
  passwordConfirm?: string;
};

export async function createUserAction(
  input: CreateUserInput
): Promise<{ data: DummyUser } | { error: string }> {
  const auth = await requireAuth();
  if (!auth) return { error: "Unauthorized" };
  if (auth.role === "admin" && input.role === "Super Admin") {
    return { error: "Doar Super Admin poate crea conturi Super Admin." };
  }
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!name || !email) return { error: "name and email required" };
  const password = (input.password ?? "").trim();
  const passwordConfirm = (input.passwordConfirm ?? "").trim();
  if (password || passwordConfirm) {
    if (password.length < 8)
      return { error: "Parola trebuie să aibă cel puțin 8 caractere." };
    if (password !== passwordConfirm) return { error: "Parolele nu coincid." };
  }
  const result = await addUser({
    name,
    email,
    role: input.role,
    active: input.active !== false,
    canManageUsers: input.role === "Admin" ? !!input.canManageUsers : undefined,
  });
  if ("error" in result) return { error: result.error.message };
  const user = result.data;
  if (password) {
    const hashed = await hashPassword(password);
    const setResult = await setUserPassword(user.id, hashed);
    if ("error" in setResult) return { error: setResult.error.message };
    const updated = setResult.data;
    const storedHash = updated?.passwordHash;
    const verifyOk =
      storedHash?.startsWith("scrypt:v1:") &&
      (await verifyPassword(password, storedHash));
    if (!verifyOk) {
      return {
        error:
          "Parola nu a putut fi salvată corect. Încearcă din nou sau folosește Resetare parolă după creare.",
      };
    }
  }
  revalidatePath("/admin/users");
  return { data: user };
}

type UpdateUserInput = Partial<{
  name: string;
  email: string;
  role: DummyUserRole;
  active: boolean;
  canManageUsers: boolean;
}>;

export async function updateUserAction(
  id: string,
  input: UpdateUserInput
): Promise<{ data: DummyUser } | { error: string }> {
  const auth = await requireAuth();
  if (!auth) return { error: "Unauthorized" };
  const u = await getUserById(id);
  if ("error" in u || !u.data) return { error: "Not found" };
  if (auth.role === "admin" && input.role === "Super Admin") {
    return { error: "Doar Super Admin poate seta rolul Super Admin." };
  }
  const isEditingSelf = auth.role === "admin" && id === auth.sub;
  const updates: UpdateUserInput = {};
  if (input.name !== undefined) updates.name = String(input.name).trim();
  if (input.email !== undefined) updates.email = String(input.email).trim().toLowerCase();
  if (input.role !== undefined) {
    if (!["Super Admin", "Admin", "Staff"].includes(input.role)) {
      return { error: "Invalid role" };
    }
    updates.role = input.role;
  }
  if (input.active !== undefined && !isEditingSelf) updates.active = input.active;
  if (input.canManageUsers !== undefined && !isEditingSelf)
    updates.canManageUsers = input.canManageUsers;
  const result = await updateUser(id, updates);
  if ("error" in result) return { error: result.error.message };
  const updated = await getUserById(id);
  const user = "data" in updated && updated.data ? updated.data : result.data!;
  revalidatePath("/admin/users");
  return { data: user };
}

export async function deleteUserAction(
  id: string
): Promise<{ ok: boolean } | { error: string }> {
  const auth = await requireAuth();
  if (!auth) return { error: "Unauthorized" };
  const result = await deleteUser(id);
  if ("error" in result) return { error: result.error.message };
  if (!result.data) return { error: "Not found" };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserPasswordAction(
  id: string,
  password: string,
  passwordConfirm: string
): Promise<{ data: DummyUser } | { error: string }> {
  const auth = await requireAuth();
  if (!auth) return { error: "Unauthorized" };
  if (password.length < 8)
    return { error: "Parola trebuie să aibă cel puțin 8 caractere." };
  if (password !== passwordConfirm) return { error: "Parolele nu coincid." };
  const hashed = await hashPassword(password);
  const setResult = await setUserPassword(id, hashed);
  if ("error" in setResult) return { error: setResult.error.message };
  const updated = setResult.data;
  const storedHash = updated?.passwordHash;
  const verifyOk =
    storedHash?.startsWith("scrypt:v1:") &&
    (await verifyPassword(password, storedHash));
  if (!verifyOk) {
    return {
      error:
        "Parola nu a putut fi salvată corect. Încearcă din nou.",
    };
  }
  revalidatePath("/admin/users");
  return { data: updated! };
}
