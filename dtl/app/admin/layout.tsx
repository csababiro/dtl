/**
 * Admin root layout: passthrough. Auth guard and nav are in (dashboard)/layout.tsx.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
