import { redirect } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

/**
 * Auth guard: redirect to /admin/login if no session.
 * When NEXT_PUBLIC_MOCK_AUTH=true, allow through for dev.
 */
function hasSession(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") return true;
  // TODO: read real session (cookie / getSession) when backend exists
  return false;
}

/** Role from session. When mock auth, return admin for full nav. */
function getRole(): "super_admin" | "admin" | "technician" {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") return "admin";
  // TODO: from JWT or GET /me when backend exists
  return "admin";
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSession()) {
    redirect("/admin/login");
  }

  const role = getRole();
  const isTechnician = role === "technician";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b p-4 flex gap-4 flex-wrap">
        {!isTechnician && (
          <>
            <Link href="/admin" className="font-medium">
              {t("admin.dashboard")}
            </Link>
            <Link href="/admin/calendar">{t("admin.calendar")}</Link>
            <Link href="/admin/appointments">{t("admin.appointments")}</Link>
            <Link href="/admin/settings">{t("admin.settings")}</Link>
            <Link href="/admin/feature-flags">{t("admin.featureFlags")}</Link>
            <Link href="/admin/services">{t("admin.services")}</Link>
            <Link href="/admin/content">{t("admin.content")}</Link>
            <Link href="/admin/users">{t("admin.users")}</Link>
          </>
        )}
        {isTechnician && (
          <>
            <Link href="/admin/calendar" className="font-medium">
              {t("admin.calendar")}
            </Link>
            <span>{t("admin.markJobDone")}</span>
          </>
        )}
        <Link href="/" className="ml-auto">
          {t("nav.home")}
        </Link>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <RegisterServiceWorker />
    </div>
  );
}
