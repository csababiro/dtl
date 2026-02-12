"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { t } from "@/lib/i18n";
import {
  type AdminFlagKey,
  type FeatureFlagToggles,
  effectiveFlag,
} from "@/lib/feature-flags";

/** Mock role until API provides session role: super_admin sees only Super Admin column, admin sees only Admin column. */
const MOCK_ADMIN_ROLE = (
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_MOCK_ADMIN_ROLE === "admin"
    ? "admin"
    : "super_admin"
) as "super_admin" | "admin";

const ADMIN_FLAG_KEYS: AdminFlagKey[] = [
  "tyre",
  "carWash",
  "requestQuote",
  "programare",
  "authentication",
  "showServicePrices",
  "showTyrePrices",
  "showCarWashPrices",
  "gallery",
  "testimonials",
];

const defaultToggles: FeatureFlagToggles = {
  tyre: { superAdmin: true, admin: true },
  carWash: { superAdmin: true, admin: true },
  requestQuote: { superAdmin: true, admin: true },
  programare: { superAdmin: true, admin: true },
  authentication: { superAdmin: true, admin: true },
  showServicePrices: { superAdmin: true, admin: true },
  showTyrePrices: { superAdmin: true, admin: true },
  showCarWashPrices: { superAdmin: true, admin: true },
  gallery: { superAdmin: true, admin: true },
  testimonials: { superAdmin: true, admin: true },
};

const flagMeta: Record<
  AdminFlagKey,
  { labelKey: string; descKey: string }
> = {
  tyre: { labelKey: "admin.flagTyre", descKey: "admin.flagTyreDesc" },
  carWash: { labelKey: "admin.flagCarWash", descKey: "admin.flagCarWashDesc" },
  requestQuote: {
    labelKey: "admin.flagRequestQuote",
    descKey: "admin.flagRequestQuoteDesc",
  },
  programare: {
    labelKey: "admin.flagProgramare",
    descKey: "admin.flagProgramareDesc",
  },
  authentication: {
    labelKey: "admin.flagAuthentication",
    descKey: "admin.flagAuthenticationDesc",
  },
  showServicePrices: {
    labelKey: "admin.flagShowServicePrices",
    descKey: "admin.flagShowServicePricesDesc",
  },
  showTyrePrices: {
    labelKey: "admin.flagShowTyrePrices",
    descKey: "admin.flagShowTyrePricesDesc",
  },
  showCarWashPrices: {
    labelKey: "admin.flagShowCarWashPrices",
    descKey: "admin.flagShowCarWashPricesDesc",
  },
  gallery: {
    labelKey: "admin.flagGallery",
    descKey: "admin.flagGalleryDesc",
  },
  testimonials: {
    labelKey: "admin.flagTestimonials",
    descKey: "admin.flagTestimonialsDesc",
  },
};

function Toggle({
  on,
  onClick,
  ariaLabel,
}: {
  on: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-12 h-6 rounded-full relative transition-colors ${
        on ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          on ? "right-1" : "left-1"
        }`}
      />
    </button>
  );
}

export function AdminFeatureFlagsClient() {
  const [toggles, setToggles] = useState<FeatureFlagToggles>(defaultToggles);

  const setSuperAdmin = (key: AdminFlagKey, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [key]: { ...prev[key], superAdmin: value },
    }));
  };
  const setAdmin = (key: AdminFlagKey, value: boolean) => {
    setToggles((prev) => ({
      ...prev,
      [key]: { ...prev[key], admin: value },
    }));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {t("admin.featureFlags")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("admin.featureFlagsRule")}
          </p>
        </div>
        <div className="bg-amber-100 text-amber-700 p-4 rounded-2xl flex items-start gap-3 max-w-sm shrink-0">
          <ShieldAlert className="shrink-0 mt-0.5" size={20} />
          <p className="text-xs font-bold leading-relaxed">
            {t("admin.featureFlagsWarning")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Funcționalitate
                </th>
                {MOCK_ADMIN_ROLE === "super_admin" && (
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center w-32">
                    {t("admin.superAdmin")}
                  </th>
                )}
                {MOCK_ADMIN_ROLE === "admin" && (
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center w-32">
                    {t("admin.adminRole")}
                  </th>
                )}
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center w-24">
                  {t("admin.effective")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ADMIN_FLAG_KEYS.map((key) => {
                const { superAdmin, admin } = toggles[key] ?? {
                  superAdmin: true,
                  admin: true,
                };
                const eff = effectiveFlag(superAdmin, admin);
                const { labelKey, descKey } = flagMeta[key];
                return (
                  <tr
                    key={key}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <span
                          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                            eff ? "bg-green-500" : "bg-slate-300"
                          }`}
                          aria-hidden
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {t(labelKey)}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {t(descKey)}
                          </p>
                        </div>
                      </div>
                    </td>
                    {MOCK_ADMIN_ROLE === "super_admin" && (
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <Toggle
                            on={superAdmin}
                            onClick={() => setSuperAdmin(key, !superAdmin)}
                            ariaLabel={`${t(labelKey)} ${t("admin.superAdmin")}`}
                          />
                        </div>
                      </td>
                    )}
                    {MOCK_ADMIN_ROLE === "admin" && (
                      <td className="px-8 py-6 text-center">
                        <div className="flex justify-center">
                          <Toggle
                            on={admin}
                            onClick={() => setAdmin(key, !admin)}
                            ariaLabel={`${t(labelKey)} ${t("admin.adminRole")}`}
                          />
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                          eff ? "text-green-600" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            eff ? "bg-green-500" : "bg-slate-300"
                          }`}
                          aria-hidden
                        />
                        {eff ? "ON" : "OFF"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          disabled
          title={t("admin.saveFlagsDisabledHint")}
          className="px-8 py-3 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed"
        >
          {t("admin.saveFlags")}
        </button>
      </div>
    </div>
  );
}
