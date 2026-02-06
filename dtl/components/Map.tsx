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
        <p className="text-slate-700">{address}</p>
      ) : (
        <p className="text-slate-500">Harta</p>
      )}
    </div>
  );
}
