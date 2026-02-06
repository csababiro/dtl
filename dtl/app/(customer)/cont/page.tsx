import { t } from "@/lib/i18n";

export default function ContPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        {t("cont.title")}
      </h1>
      <p className="text-slate-600 mb-6">{t("cont.encourageAccount")}</p>
      <p className="text-slate-600">{t("cont.signIn")} / {t("cont.signUp")}</p>
    </div>
  );
}
