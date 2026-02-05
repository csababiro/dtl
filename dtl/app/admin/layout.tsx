/**
 * Admin root layout – no guard here; (dashboard) group has the auth guard.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
