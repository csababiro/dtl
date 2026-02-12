import { t } from "@/lib/i18n";
import { DUMMY_USERS } from "@/lib/dummy-users";
import { AdminUsersClient } from "@/components/AdminUsersClient";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          {t("admin.users")}
        </h1>
        <p className="text-slate-500 mt-1">
          Listă utilizatori (date dummy, fără API).
        </p>
      </div>

      <AdminUsersClient users={DUMMY_USERS} />
    </div>
  );
}
