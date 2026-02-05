import Link from "next/link";
import { t } from "@/lib/i18n";
import type { FeatureFlags } from "@/lib/feature-flags";
import { isAnyBookingEnabled } from "@/lib/feature-flags";

export type ServiceItem = {
  id: string;
  name: string;
  price?: string;
  description?: string;
  imageUrl?: string;
};

/**
 * List of services with prices and images. CTA "Programare" when booking flag on.
 */
export default function ServiceList({
  services,
  flags,
}: {
  services: ServiceItem[];
  flags: FeatureFlags;
}) {
  const showProgramareCta = isAnyBookingEnabled(flags);

  return (
    <div className="space-y-6">
      {services.length === 0 ? (
        <p className="text-gray-500">Nu există servicii afișate.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="border rounded-lg p-4">
              {s.imageUrl && (
                <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="font-semibold">{s.name}</h3>
              {s.price != null && (
                <p className="text-sm text-gray-600 mt-1">{s.price}</p>
              )}
              {s.description != null && (
                <p className="text-sm mt-2">{s.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {showProgramareCta && (
        <p className="mt-6">
          <Link
            href="/programare"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {t("nav.programare")}
          </Link>
        </p>
      )}
    </div>
  );
}
