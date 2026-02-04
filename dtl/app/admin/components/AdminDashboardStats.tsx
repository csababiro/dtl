"use client";

/**
 * Mock revenue and service volume (API will provide later).
 */
export function AdminDashboardStats() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-zinc-500">Azi</h3>
        <p className="mt-1 text-2xl font-semibold text-zinc-900">— lei</p>
        <p className="text-sm text-zinc-600">— servicii</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-zinc-500">Săptămâna aceasta</h3>
        <p className="mt-1 text-2xl font-semibold text-zinc-900">— lei</p>
        <p className="text-sm text-zinc-600">— servicii</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-zinc-500">Luna aceasta</h3>
        <p className="mt-1 text-2xl font-semibold text-zinc-900">— lei</p>
        <p className="text-sm text-zinc-600">— servicii</p>
      </div>
    </div>
  );
}
