import { get, post, patch, del } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";

export type { DummyUser, DummyUserRole };

export async function getUsers(): Promise<
  { data: DummyUser[] } | { error: ApiError }
> {
  const result = await get<{ items: DummyUser[] }>("/users");
  if ("error" in result) return { error: result.error };
  return { data: result.data.items };
}

export async function getUserById(
  id: string
): Promise<{ data: DummyUser } | { error: ApiError }> {
  return get<DummyUser>(`/users/${id}`);
}

export async function createUser(body: {
  name: string;
  email: string;
  role?: DummyUserRole;
  active?: boolean;
  canManageUsers?: boolean;
}): Promise<{ data: DummyUser } | { error: ApiError }> {
  return post<DummyUser, typeof body>("/users", body);
}

export async function updateUser(
  id: string,
  body: Partial<{ name: string; email: string; role: DummyUserRole; active: boolean; canManageUsers: boolean }>
): Promise<{ data: DummyUser } | { error: ApiError }> {
  return patch<DummyUser, typeof body>(`/users/${id}`, body);
}

export async function deleteUser(
  id: string
): Promise<{ data: void } | { error: ApiError }> {
  return del<void>(`/users/${id}`);
}
