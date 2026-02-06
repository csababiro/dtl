import { redirect } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
  if (!mockAuth) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-slate-50 p-4">
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.dashboard")}
          </Link>
          <Link href="/admin/calendar" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.calendar")}
          </Link>
          <Link href="/admin/appointments" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.appointments")}
          </Link>
          <Link href="/admin/quotes" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.quotes")}
          </Link>
          <Link href="/admin/settings" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.settings")}
          </Link>
          <Link href="/admin/feature-flags" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.featureFlags")}
          </Link>
          <Link href="/admin/services" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.services")}
          </Link>
          <Link href="/admin/content" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.content")}
          </Link>
          <Link href="/admin/users" className="block py-2 text-slate-700 hover:text-blue-600">
            {t("admin.users")}
          </Link>
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
