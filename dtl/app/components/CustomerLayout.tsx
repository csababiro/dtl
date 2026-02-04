"use client";

import { usePathname } from "next/navigation";
import { CustomerHeader } from "./CustomerHeader";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CustomerHeader />
      {children}
    </>
  );
}
