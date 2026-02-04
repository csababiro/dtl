"use client";

/**
 * Embedded Google Map; address from Business Settings (mock until API).
 */
export function GoogleMap({ address }: { address?: string }) {
  const displayAddress = address || "Adresa service (configurabilă din setări)";
  // Placeholder: real embed would use Google Maps iframe/API with address
  return (
    <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
      <div className="flex h-full min-h-[200px] items-center justify-center p-4 text-center text-zinc-600">
        <div>
          <p className="font-medium">Hartă – {displayAddress}</p>
          <p className="mt-1 text-sm">Integrare Google Maps va fi adăugată cu cheie API.</p>
        </div>
      </div>
    </div>
  );
}
