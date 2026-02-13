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
} from "lucide-react";
import type { DummyUser, DummyUserRole } from "@/lib/dummy-users";
import { t } from "@/lib/i18n";
import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
  setUserActiveAction,
} from "@/app/admin/(dashboard)/users/actions";

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

interface AdminUsersClientProps {
  users: DummyUser[];
  canManageUsers: boolean;
}

export function AdminUsersClient({ users, canManageUsers }: AdminUsersClientProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState<"new" | DummyUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const openCreate = () => setFormOpen("new");
  const openEdit = (user: DummyUser) => setFormOpen(user);
  const closeForm = () => setFormOpen(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await createUserAction(fd);
    setPending(false);
    if (res.ok) {
      closeForm();
      form.reset();
      router.refresh();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await updateUserAction(fd);
    setPending(false);
    if (res.ok) {
      closeForm();
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    setPending(true);
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteUserAction(fd);
    setPending(false);
    setDeleteConfirm(null);
    if (res.ok) router.refresh();
  };

  const handleToggleActive = async (user: DummyUser) => {
    setPending(true);
    const fd = new FormData();
    fd.set("id", user.id);
    fd.set("active", String(!user.active));
    const res = await setUserActiveAction(fd);
    setPending(false);
    if (res.ok) router.refresh();
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
                    disabled={pending}
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
                          disabled={pending}
                          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                          title={user.active ? t("admin.userInactive") : t("admin.userActive")}
                        >
                          {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
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
                  {ROLES.map((r) => (
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
                  className="rounded border-slate-300"
                />
                <label htmlFor="form-active" className="text-sm font-medium text-slate-700">
                  {t("admin.userActive")}
                </label>
              </div>
              <div className="flex items-center gap-2" id="can-manage-wrap">
                <input
                  type="checkbox"
                  name="canManageUsers"
                  id="form-can-manage"
                  defaultChecked={editUser?.canManageUsers ?? false}
                  value="on"
                  className="rounded border-slate-300"
                />
                <label htmlFor="form-can-manage" className="text-sm font-medium text-slate-700">
                  {t("admin.canManageUsers")}
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
