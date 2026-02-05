/**
 * Google Map – one component; address from settings (props).
 * Placeholder until Google Maps API key is configured.
 */
export default function Map({ address }: { address?: string }) {
  if (!address || address === "—") {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded">
        Hartă – adresa: {address || "nesetată"}
      </div>
    );
  }
  const encoded = encodeURIComponent(address);
  const embedUrl = `https://www.google.com/maps?q=${encoded}&output=embed`;
  return (
    <div className="w-full h-64 rounded overflow-hidden">
      <iframe
        title="Locație"
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
