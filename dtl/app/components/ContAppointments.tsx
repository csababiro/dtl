"use client";

/**
 * Authenticated customer: appointments + invoices (mock until API/auth).
 */
export function ContAppointments() {
  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Programările mele</h2>
        <p className="mt-2 text-sm text-zinc-600">
          După autentificare veți vedea aici programările (solicitate, confirmată, finalizată).
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Autentificare: email/parolă, telefon (SMS) sau Google – va fi implementată cu backend-ul.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Facturi și plăți</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Prețul final și eventualele linii de facturare vor fi vizibile aici după ce staff-ul le completează.
        </p>
      </section>
    </div>
  );
}
