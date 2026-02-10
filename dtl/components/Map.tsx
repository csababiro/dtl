import { getMapsUrl } from "@/lib/maps";

interface MapProps {
  address?: string | null;
  className?: string;
}

export function Map({ address, className }: MapProps) {
  return (
    <div
      className={`border rounded-lg p-4 bg-slate-50 min-h-[200px] ${className ?? ""}`}
    >
      {address ? (
        <a
          href={getMapsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-700 hover:text-blue-600 transition-colors"
        >
          {address}
        </a>
      ) : (
        <p className="text-slate-500">Harta</p>
      )}
    </div>
  );
}
