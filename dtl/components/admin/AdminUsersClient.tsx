"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  Shield,
  Plus,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  X,
  Copy,
  Check,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import { t } from "@/lib/i18n";
import { post, patch, del } from "@/lib/api-client";

export type AdminUsersActions = {
  createUser: (input: {
    name: string;
    email: string;
    role: DummyUserRole;
    active: boolean;
    canManageUsers?: boolean;
    password?: string;
    passwordConfirm?: string;
  }) => Promise<{ data: DummyUser } | { error: string }>;
  updateUser: (
    id: string,
    input: Partial<{ name: string; email: string; role: DummyUserRole; active: boolean; canManageUsers: boolean }>
  ) => Promise<{ data: DummyUser } | { error: string }>;
  deleteUser: (id: string) => Promise<{ ok: boolean } | { error: string }>;
  setUserPassword: (
    id: string,
    password: string,
    passwordConfirm: string
  ) => Promise<{ data: DummyUser } | { error: string }>;
};

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

const ROLES: DummyUserRole[] = ["Super Admin", "Admin", "Staff"];
const ROLES_ADMIN_OR_STAFF: DummyUserRole[] = ["Admin", "Staff"];

interface AdminUsersClientProps {
  users: DummyUser[];
  canManageUsers: boolean;
  currentUserId?: string;
  isSuperAdmin?: boolean;
  /** When provided (e.g. client-fetched page), called after mutations instead of router.refresh(). */
  onRefetch?: () => void | Promise<void>;
  /** Server actions for Vercel - avoids cookie issues with client-side fetch */
  actions?: AdminUsersActions;
}

export function AdminUsersClient({
  users,
  canManageUsers,
  currentUserId = "",
  isSuperAdmin = false,
  onRefetch,
  actions,
}: AdminUsersClientProps) {
  const allowedRoles = isSuperAdmin ? ROLES : ROLES_ADMIN_OR_STAFF;
  const isSelf = (user: DummyUser): boolean =>
    Boolean(currentUserId && user.id === currentUserId);
  const router = useRouter();
  const [formOpen, setFormOpen] = useState<"new" | DummyUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<DummyUser | null>(null);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const openCreate = () => setFormOpen("new");
  const openEdit = (user: DummyUser) => setFormOpen(user);
  const closeForm = () => setFormOpen(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setPending(true);
    setInvitationLink(null);
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim() ?? "";
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim().toLowerCase() ?? "";
    const roleRaw = (form.querySelector('[name="role"]') as HTMLSelectElement)?.value ?? "Staff";
    const role = (roleRaw === "Admin" || roleRaw === "Staff" ? roleRaw : "Staff") as DummyUserRole;
    const active = (form.querySelector('[name="active"]') as HTMLInputElement)?.checked ?? true;
    const canManageUsers = (form.querySelector('[name="canManageUsers"]') as HTMLInputElement)?.checked ?? false;
    const password = (form.querySelector('[name="password"]') as HTMLInputElement)?.value?.trim() ?? "";
    const passwordConfirm = (form.querySelector('[name="passwordConfirm"]') as HTMLInputElement)?.value?.trim() ?? "";
    if (password || passwordConfirm) {
      if (password.length < 8) {
        setFormError(t("admin.passwordMinLength"));
        setPending(false);
        return;
      }
      if (password !== passwordConfirm) {
        setFormError(t("admin.passwordMismatch"));
        setPending(false);
        return;
      }
    }
    if (actions) {
      const res = await actions.createUser({
        name,
        email,
        role,
        active,
        canManageUsers: role === "Admin" ? canManageUsers : undefined,
        ...(password ? { password, passwordConfirm } : {}),
      });
      setPending(false);
      if ("error" in res) {
        setFormError(res.error);
        return;
      }
    } else {
      const payload: Record<string, unknown> = {
        name,
        email,
        role,
        active,
        canManageUsers: role === "Admin" ? canManageUsers : undefined,
      };
      if (password) {
        payload.password = password;
        payload.passwordConfirm = passwordConfirm;
      }
      const res = await post<DummyUser>("/users", payload);
      setPending(false);
      if ("error" in res) {
        if (res.error.status === 401) router.push("/admin/login");
        else setFormError(res.error.message);
        return;
      }
    }
    closeForm();
    form.reset();
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const id = (form.querySelector('[name="id"]') as HTMLInputElement)?.value?.trim();
    if (!id) {
      setPending(false);
      return;
    }
    const editingSelf = currentUserId && id === currentUserId;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value?.trim();
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim().toLowerCase();
    const role = (form.querySelector('[name="role"]') as HTMLSelectElement)?.value as DummyUserRole | undefined;
    const activeEl = form.querySelector('[name="active"]') as HTMLInputElement;
    const active = activeEl ? activeEl.checked : undefined;
    const canManageEl = form.querySelector('[name="canManageUsers"]') as HTMLInputElement;
    const canManageUsersValue = canManageEl ? canManageEl.checked : undefined;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (active !== undefined && !editingSelf) updates.active = active;
    if (canManageUsersValue !== undefined && !editingSelf) updates.canManageUsers = canManageUsersValue;
    if (actions) {
      const res = await actions.updateUser(id, updates);
      setPending(false);
      if ("error" in res) return;
    } else {
      const res = await patch<DummyUser>(`/users/${id}`, updates);
      setPending(false);
      if ("error" in res) {
        if (res.error.status === 401) router.push("/admin/login");
        return;
      }
    }
    closeForm();
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  const handleDelete = async (id: string) => {
    setPending(true);
    if (actions) {
      const res = await actions.deleteUser(id);
      if ("error" in res) {
        setPending(false);
        setDeleteConfirm(null);
        return;
      }
    } else {
      const res = await del<void>(`/users/${id}`);
      if ("error" in res) {
        if (res.error.status === 401) router.push("/admin/login");
        setPending(false);
        setDeleteConfirm(null);
        return;
      }
    }
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  const handleToggleActive = async (user: DummyUser) => {
    setPending(true);
    if (actions) {
      const res = await actions.updateUser(user.id, { active: !user.active });
      setPending(false);
      if ("error" in res) return;
    } else {
      const res = await patch<DummyUser>(`/users/${user.id}`, { active: !user.active });
      setPending(false);
      if ("error" in res) {
        if (res.error.status === 401) router.push("/admin/login");
        return;
      }
    }
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!resetPasswordUser) return;
    e.preventDefault();
    setFormError(null);
    const form = e.currentTarget;
    const password = (form.querySelector('[name="resetPassword"]') as HTMLInputElement)?.value?.trim() ?? "";
    const passwordConfirm = (form.querySelector('[name="resetPasswordConfirm"]') as HTMLInputElement)?.value?.trim() ?? "";
    if (password.length < 8) {
      setFormError(t("admin.passwordMinLength"));
      return;
    }
    if (password !== passwordConfirm) {
      setFormError(t("admin.passwordMismatch"));
      return;
    }
    setPending(true);
    if (actions?.setUserPassword) {
      const res = await actions.setUserPassword(
        resetPasswordUser.id,
        password,
        passwordConfirm
      );
      setPending(false);
      if ("error" in res) {
        setFormError(res.error);
        return;
      }
    } else {
      const res = await patch<DummyUser>(`/users/${resetPasswordUser.id}`, {
        password,
        passwordConfirm,
      });
      setPending(false);
      if ("error" in res) {
        if (res.error.status === 401) router.push("/admin/login");
        else setFormError(res.error.message);
        return;
      }
    }
    setResetPasswordUser(null);
    form.reset();
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  const isEdit = formOpen !== null && formOpen !== "new";
  const editUser = isEdit ? (formOpen as DummyUser) : null;

  return (
    <div className="space-y-4">
      {canManageUsers && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            <Plus size={20} />
            {t("admin.addUser")}
          </button>
        </div>
      )}

      <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
        {/* Mobile: cards */}
        <div className="md:hidden space-y-4 p-2 sm:p-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <User size={24} className="text-slate-600" />
                </div>
                <span className="font-bold text-slate-900 text-lg">{user.name}</span>
              </div>
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 hover:underline flex items-center gap-2 text-base"
              >
                <Mail size={18} />
                {user.email}
              </a>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                    user.role === "Super Admin"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <Shield size={16} />
                  {user.role === "Staff" ? t("admin.roleStaff") : user.role}
                </span>
                {user.role === "Admin" && user.canManageUsers && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    {t("admin.canManageUsers")}
                  </span>
                )}
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
                    user.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {user.active ? t("admin.userActive") : t("admin.userInactive")}
                </span>
              </div>
              <p className="text-slate-600 text-sm pt-3 border-t border-slate-100">
                {t("admin.lastLogin")}: {formatDate(user.lastLogin)}
              </p>
              {canManageUsers && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => openEdit(user)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
                  >
                    <Pencil size={16} />
                    {t("common.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(user)}
                    disabled={pending || isSelf(user)}
                    title={isSelf(user) ? t("admin.selfNoEdit") : undefined}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 disabled:opacity-50"
                  >
                    {user.active ? <UserX size={16} /> : <UserCheck size={16} />}
                    {user.active ? t("admin.userInactive") : t("admin.userActive")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(user.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    {t("common.delete")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Utilizator
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Rol
                </th>
                {canManageUsers && (
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    {t("admin.canManageUsers")}
                  </th>
                )}
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  {t("admin.lastLogin")}
                </th>
                {canManageUsers && (
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    {t("admin.actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <User size={20} className="text-slate-600" />
                      </div>
                      <span className="font-bold text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Mail size={16} />
                      {user.email}
                    </a>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === "Super Admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "Admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Shield size={14} />
                      {user.role === "Staff" ? t("admin.roleStaff") : user.role}
                    </span>
                  </td>
                  {canManageUsers && (
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {user.role === "Admin"
                        ? user.canManageUsers
                          ? "Da"
                          : "Nu"
                        : "—"}
                    </td>
                  )}
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.active ? t("admin.userActive") : t("admin.userInactive")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-600 text-sm">
                    {formatDate(user.lastLogin)}
                  </td>
                  {canManageUsers && (
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                          title={t("common.edit")}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(user)}
                          disabled={pending || isSelf(user)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          title={isSelf(user) ? t("admin.selfNoEdit") : (user.active ? t("admin.userInactive") : t("admin.userActive"))}
                        >
                          {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetPasswordUser(user)}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                          title={t("admin.resetPassword")}
                        >
                          <KeyRound size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(user.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          title={t("common.delete")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit modal */}
      {formOpen !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {isEdit ? t("admin.editUser") : t("admin.addUser")}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={isEdit ? handleUpdate : handleCreate}
              className="p-4 space-y-4"
            >
              {isEdit && <input type="hidden" name="id" value={editUser!.id} />}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nume
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editUser?.name}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={editUser?.email}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                />
              </div>
              {!isEdit && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t("admin.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showCreatePassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        placeholder={t("admin.passwordOptionalOnCreate")}
                        className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCreatePassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        aria-label={showCreatePassword ? "Ascunde parola" : "Arată parola"}
                      >
                        {showCreatePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {t("admin.confirmPassword")}
                    </label>
                    <div className="relative">
                      <input
                        type={showCreateConfirm ? "text" : "password"}
                        name="passwordConfirm"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCreateConfirm((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        aria-label={showCreateConfirm ? "Ascunde parola" : "Arată parola"}
                      >
                        {showCreateConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </>
              )}
              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  required
                  defaultValue={editUser?.role ?? "Staff"}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                >
                  {allowedRoles.map((r) => (
                    <option key={r} value={r}>
                      {r === "Staff" ? t("admin.roleStaff") : r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  id="form-active"
                  defaultChecked={editUser?.active ?? true}
                  value="on"
                  disabled={editUser != null && isSelf(editUser)}
                  className="rounded border-slate-300 disabled:opacity-60"
                />
                <label htmlFor="form-active" className="text-sm font-medium text-slate-700">
                  {t("admin.userActive")}
                  {editUser != null && isSelf(editUser) && (
                    <span className="text-slate-400 ml-1">({t("admin.selfNoEdit")})</span>
                  )}
                </label>
              </div>
              <div className="flex items-center gap-2" id="can-manage-wrap">
                <input
                  type="checkbox"
                  name="canManageUsers"
                  id="form-can-manage"
                  defaultChecked={editUser?.canManageUsers ?? false}
                  value="on"
                  disabled={editUser != null && isSelf(editUser)}
                  className="rounded border-slate-300 disabled:opacity-60"
                />
                <label htmlFor="form-can-manage" className="text-sm font-medium text-slate-700">
                  {t("admin.canManageUsers")}
                  {editUser != null && isSelf(editUser) && (
                    <span className="text-slate-400 ml-1">({t("admin.selfNoEdit")})</span>
                  )}
                </label>
              </div>
              <p className="text-xs text-slate-500">
                {t("admin.canManageUsers")} se aplică doar pentru rolul Admin.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  {pending ? t("common.loading") : t("common.save")}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetPasswordUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => { setResetPasswordUser(null); setFormError(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t("admin.resetPasswordTitle")}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t("admin.resetPasswordDesc")} – {resetPasswordUser.name} ({resetPasswordUser.email})
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("admin.password")}
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    name="resetPassword"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label={showResetPassword ? "Ascunde parola" : "Arată parola"}
                  >
                    {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("admin.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showResetConfirm ? "text" : "password"}
                    name="resetPasswordConfirm"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    aria-label={showResetConfirm ? "Ascunde parola" : "Arată parola"}
                  >
                    {showResetConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {formError && (
                <p className="text-sm text-red-600">{formError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  {pending ? t("common.loading") : t("common.save")}
                </button>
                <button
                  type="button"
                  onClick={() => { setResetPasswordUser(null); setFormError(null); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invitation link modal */}
      {invitationLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => { setInvitationLink(null); setLinkCopied(false); }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("admin.invitationLinkTitle")}
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Linkul expiră în 7 zile. Utilizatorul va seta parola la primul acces.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                readOnly
                value={invitationLink}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(invitationLink);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 shrink-0"
              >
                {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                {linkCopied ? t("admin.invitationLinkCopied") : t("admin.invitationLinkCopy")}
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setInvitationLink(null); setLinkCopied(false); }}
              className="w-full py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-slate-700 mb-4">{t("admin.confirmDeleteUser")}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={pending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {t("common.delete")}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
