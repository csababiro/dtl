import { t } from "@/lib/i18n";
import Link from "next/link";
import { redirect } from "next/navigation";

const MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

type LayoutProps = { children: React.ReactNode };

/**
 * Auth guard for admin dashboard: redirect to /admin/login when not authenticated.
 */
export default function AdminDashboardLayout({ children }: LayoutProps) {
  const isAuthenticated = MOCK_AUTH;

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const role = "admin" as "super_admin" | "admin" | "technician";
  const isTechnician = role === "technician";

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-4 py-3">
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/admin" className="font-medium text-blue-600">
            {t("admin.title")}
          </Link>
          {!isTechnician && (
            <>
              <Link href="/admin" className="text-zinc-700 hover:text-zinc-900">
                {t("admin.dashboard")}
              </Link>
              <Link
                href="/admin/calendar"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.calendar")}
              </Link>
              <Link
                href="/admin/appointments"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.appointments")}
              </Link>
              <Link
                href="/admin/settings"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.settings")}
              </Link>
              <Link
                href="/admin/feature-flags"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.featureFlags")}
              </Link>
              <Link
                href="/admin/services"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.services")}
              </Link>
              <Link
                href="/admin/content"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.content")}
              </Link>
              <Link
                href="/admin/users"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.users")}
              </Link>
            </>
          )}
          {isTechnician && (
            <>
              <Link
                href="/admin/calendar"
                className="text-zinc-700 hover:text-zinc-900"
              >
                {t("admin.calendar")}
              </Link>
              <span className="text-zinc-500">{t("admin.markJobDone")}</span>
            </>
          )}
        </nav>
      </header>
      {children}
    </div>
  );
}
