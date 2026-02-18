"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

interface AdminPanelGateProps {
  role: string;
  children: React.ReactNode;
}

export function AdminPanelGate({ role, children }: AdminPanelGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (role === "super_admin") {
      setReady(true);
      return;
    }
    let cancelled = false;
    fetch("/api/settings/feature-flags", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.adminPanelEnabled === false) {
          router.replace("/admin/disabled");
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [role, router]);

  if (role === "super_admin" || ready) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">{t("common.loading")}</p>
    </div>
  );
}
