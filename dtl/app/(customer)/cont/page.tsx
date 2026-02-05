import Link from "next/link";
import { t } from "@/lib/i18n";

export default function ContPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{t("cont.title")}</h1>
      <p className="text-gray-600 mb-4">
        Cont simplu: istoric programări și facturi, opțiune email promoțional.
      </p>
      <p className="text-sm text-gray-500">
        Creează cont la înregistrare; bifă consimțământ pentru emailuri promoționale.
      </p>
      <p className="mt-6">
        <Link href="/programare" className="text-blue-600 underline">
          {t("nav.programare")}
        </Link>
      </p>
    </main>
  );
}
