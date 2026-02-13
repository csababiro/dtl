"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { DummyUserRole } from "@/lib/dummy-users";
import {
  getCurrentUserCanManageUsers,
  addUser,
  updateUser,
  deleteUser,
  createInvitation,
} from "@/lib/services";

async function guardCanManage() {
  const result = await getCurrentUserCanManageUsers();
  if ("error" in result || !result.data) return { ok: false as const, error: "forbidden" as const };
  return { ok: true as const };
}

export async function createUserAction(formData: FormData) {
  const guard = await guardCanManage();
  if (!guard.ok) return guard;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "").trim() as DummyUserRole;
  const active = formData.get("active") === "on" || formData.get("active") === "true";
  const canManageUsers = formData.get("canManageUsers") === "on" || formData.get("canManageUsers") === "true";

  if (!name || !email) return { ok: false, error: "validation" as const };
  const validRoles: DummyUserRole[] = ["Super Admin", "Admin", "Staff"];
  if (!validRoles.includes(role)) return { ok: false, error: "validation" as const };

  const addResult = await addUser({
    name,
    email,
    role,
    active,
    canManageUsers: role === "Admin" ? canManageUsers : undefined,
  });
  if ("error" in addResult) return { ok: false, error: "validation" as const };
  const user = addResult.data;
  const invResult = await createInvitation(user.id, user.email);
  if ("error" in invResult) return { ok: false, error: "validation" as const };
  const inv = invResult.data;
  const h = await headers();
  const host = h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = host ? `${proto}://${host}` : "";
  const invitationLink = base ? `${base}/admin/set-password?token=${inv.token}` : "";
  revalidatePath("/admin/users");
  return { ok: true, user, invitationLink };
}

export async function updateUserAction(formData: FormData) {
  const guard = await guardCanManage();
  if (!guard.ok) return guard;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "validation" as const };

  const name = formData.get("name") != null ? String(formData.get("name")).trim() : undefined;
  const email = formData.get("email") != null ? String(formData.get("email")).trim().toLowerCase() : undefined;
  const role = formData.get("role") != null ? (String(formData.get("role")).trim() as DummyUserRole) : undefined;
  const activeRaw = formData.get("active");
  const active = activeRaw === "on" || activeRaw === "true" ? true : activeRaw === "false" ? false : undefined;
  const canManageRaw = formData.get("canManageUsers");
  const canManageUsers = canManageRaw === "on" || canManageRaw === "true" ? true : canManageRaw === "false" ? false : undefined;

  if (role && !["Super Admin", "Admin", "Staff"].includes(role)) return { ok: false, error: "validation" as const };

  const result = await updateUser(id, {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(role !== undefined && { role }),
    ...(active !== undefined && { active }),
    ...(canManageUsers !== undefined && { canManageUsers }),
  });
  if ("error" in result) return { ok: false, error: "not_found" as const };
  if (!result.data) return { ok: false, error: "not_found" as const };
  revalidatePath("/admin/users");
  return { ok: true, user: result.data };
}

export async function deleteUserAction(formData: FormData) {
  const guard = await guardCanManage();
  if (!guard.ok) return guard;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, error: "validation" as const };

  const result = await deleteUser(id);
  if ("error" in result) return { ok: false, error: "not_found" as const };
  if (!result.data) return { ok: false, error: "not_found" as const };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserActiveAction(formData: FormData) {
  const guard = await guardCanManage();
  if (!guard.ok) return guard;

  const id = String(formData.get("id") ?? "").trim();
  const active = formData.get("active") === "true";
  if (!id) return { ok: false, error: "validation" as const };

  const result = await updateUser(id, { active });
  if ("error" in result) return { ok: false, error: "not_found" as const };
  if (!result.data) return { ok: false, error: "not_found" as const };
  revalidatePath("/admin/users");
  return { ok: true, user: result.data };
}
