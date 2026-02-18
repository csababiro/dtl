"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminFeatureFlagsClient } from "@/components/admin/AdminFeatureFlagsClient";
import { t } from "@/lib/i18n";

export default function AdminFeatureFlagsPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.role !== "super_admin") {
          router.replace("/admin");
          return;
        }
        setAllowed(true);
      })
      .catch(() => router.replace("/admin"));
  }, [router]);

  if (allowed !== true) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-500">{t("common.loading")}</p>
      </div>
    );
  }
  return <AdminFeatureFlagsClient />;
}
