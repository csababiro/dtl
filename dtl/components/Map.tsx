"use client";

/**
 * Placeholder for Google Maps. Will be replaced with embedded map using business address.
 */
export interface MapProps {
  address?: string | null;
  className?: string;
}

export function Map({ address, className = "" }: MapProps) {
  return (
    <div
      className={`flex min-h-[200px] items-center justify-center bg-zinc-200 text-zinc-500 ${className}`}
      aria-label="Hartă locație"
    >
      {address ? (
        <p className="text-center text-sm">Mapă: {address}</p>
      ) : (
        <p className="text-center text-sm">Hartă (adresa va fi afișată aici)</p>
      )}
    </div>
  );
}
