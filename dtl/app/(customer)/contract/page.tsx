import { t } from "@/lib/i18n";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ContractPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-20">
      <p className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← {t("nav.home")}
        </Link>
      </p>

      <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-lg prose-p:text-slate-700 prose-li:text-slate-700">
        <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-8">
          {t("contract.title")}
        </h1>

        <p className="text-slate-600 text-sm mb-6">
          {t("contract.intro")}
        </p>

        <h2>1. Părțile contractante</h2>
        <ul>
          <li><strong>Furnizorul (PFA)</strong>: persoana fizică autorizată care furnizează serviciile (dezvoltare site, gazduire, mentenanță), în continuare „Furnizor”.</li>
          <li><strong>Beneficiarul</strong>: persoana juridică sau fizică care achiziționează serviciile, în continuare „Beneficiar”.</li>
        </ul>

        <h2>2. Obiectul contractului</h2>
        <p>Furnizorul se obligă să presteze servicii de dezvoltare, livrare, gazduire și mentenanță pentru site-ul web al Beneficiarului, conform ofertei acceptate (pachet ales). Beneficiarul se obligă să plătească tarifele convenite și să respecte obligațiile din prezentul contract.</p>

        <h2>3. Condiții financiare</h2>
        <ul>
          <li>Prețul pachetului (dezvoltare inițială) este cel din ofertă (700 € / 1.000 € / 1.200 €), plătibil conform ofertei.</li>
          <li>Abonamentul de gazduire și mentenanță este <strong>obligatoriu</strong>: 50 €/lună. Include până la 1 oră/lună pentru actualizări și mentenanță. Fără acest abonament Furnizorul nu poate garanta funcționarea site-ului.</li>
          <li>Intervenții și modificări adiționale (peste ce e inclus): 30 €/oră, facturabil separat.</li>
          <li>Prețurile sunt în euro (€). Facturarea se face în lei la cursul BNR din ziua emiterii, dacă nu se convine altfel.</li>
        </ul>

        <h2>4. Obligațiile Furnizorului</h2>
        <ul>
          <li>Prestarea serviciilor conform ofertei și a specificațiilor agreate.</li>
          <li>Gazduire, mentenanță tehnică și suport în limita orelor incluse (1 oră/lună).</li>
          <li>Furnizorul nu este obligat să efectueze modificări care depășesc cadrul ofertei sau orele incluse, fără acord și tarif suplimentar.</li>
        </ul>

        <h2>5. Obligațiile Beneficiarului</h2>
        <ul>
          <li>Plata la termen a facturilor emise (pachet, abonament, ore suplimentare).</li>
          <li>Furnizarea informațiilor, conținutului și accesurilor necesare pentru prestarea serviciilor.</li>
          <li>Răspunderea exclusivă pentru conținutul publicat pe site (texte, imagini, date) și pentru conformitatea acestuia cu legislația (inclusiv GDPR, drepturi de autor).</li>
          <li>Comunicarea în timp util a oricăror probleme; Furnizorul nu răspunde pentru daune cauzate de întârzierea sau inexactitatea informațiilor furnizate de Beneficiar.</li>
        </ul>

        <h2>6. Limitarea răspunderii (protecție Furnizor PFA)</h2>
        <ul>
          <li>Furnizorul răspunde doar pentru daune directe, cauzate în mod direct și previzibil de neîndeplinirea obligațiilor sale, și doar în măsura în care acestea rezultă din fapte dovedite ale Furnizorului.</li>
          <li><strong>Furnizorul nu răspunde</strong>: pentru daune indirecte, consecutive, din pierderea de profit, pierderea de date (dincolo de obligațiile explicite de backup), daune cauzate de terți (furnizori de hosting, domeniu, servicii externe), utilizarea greșită a site-ului de către Beneficiar sau utilizatori, întârzieri sau nefuncționări cauzate de Beneficiar (lipsă date, refuz acces, neplată), caz fortuit sau forță majoră (legi, reglementări, calamități, război, blocaje tehnice majore ale terților), sau pentru orice consecințe juridice (amendamente, sancțiuni, litigii) rezultate din conținutul sau utilizarea site-ului de către Beneficiar.</li>
          <li>Răspunderea totală a Furnizorului este limitată la suma încasată de la Beneficiar în ultimele 12 luni pentru serviciile care au cauzat dauna, fără a depăși niciodată valoarea contractului (pachet + 12 luni abonament).</li>
          <li>Furnizorul nu oferă garanții legate de neîntrerupte funcționare, compatibilitate cu orice dispozitiv sau software terț, sau rezultate comerciale (trafic, conversii). Serviciile sunt furnizate „așa cum sunt”, în limita celor agreate.</li>
        </ul>

        <h2>7. Caz fortuit și forță majoră</h2>
        <p>Niciuna dintre părți nu răspunde pentru neîndeplinirea obligațiilor cauzată de evenimente de caz fortuit sau forță majoră (legislație, autorități, calamități, război, pandemie, defecțiuni majore ale infrastructurii terțe). În acest caz, termenele se prelungesc rezonabil; dacă situația se prelungește peste 60 de zile, oricare parte poate denunța contractul fără penalități.</p>

        <h2>8. Proprietate intelectuală și confidențialitate</h2>
        <ul>
          <li>Codul sursă, arhitectura și instrumentele proprii ale Furnizorului rămân proprietatea Furnizorului. Beneficiarul primește dreptul de utilizare a site-ului livrat (incl. admin) în scopul agreat. Conținutul și datele introduse de Beneficiar rămân proprietatea Beneficiarului.</li>
          <li>Părțile se obligă să păstreze confidențialitatea informațiilor de business și tehnice de care au acces în legătură cu contractul.</li>
        </ul>

        <h2>9. Reziliere și efecte</h2>
        <ul>
          <li>Abonamentul (50 €/lună) se poate rezilia cu preaviz de 30 de zile, comunicat în scris. Până la data efectivă a rezilierii, toate sumele rămase datorate rămân exigibile.</li>
          <li>În caz de neplată la termen, Furnizorul poate suspenda serviciile după o perioadă rezonabilă de notificare (min. 7 zile). Rezilierea pentru neplată nu exonerează Beneficiarul de plata sumelor datorate.</li>
          <li>La încetarea contractului, Furnizorul poate opri gazduirea și accesul; exportul datelor (dacă este tehnic posibil) poate fi oferit contra cost, conform tarifului pentru intervenții adiționale.</li>
        </ul>

        <h2>10. Legea aplicabilă și litigii</h2>
        <p>Prezentul contract este guvernat de legea română. Orice litigiu va fi soluționat de instanțele competente din România. Prezența clauzelor de limitare a răspunderii este esențială pentru încheierea contractului de către Furnizor.</p>

        <h2>11. Dispoziții finale</h2>
        <ul>
          <li>Acceptarea ofertei și/sau plata avansului sau a primei facturi constituie acceptarea prezentelor condiții contractuale.</li>
          <li>Modificările contractuale sunt valabile doar dacă sunt făcute în scris și semnate de ambele părți.</li>
          <li>Dacă o prevedere este declarată nulă, celelalte prevederi rămân în vigoare.</li>
        </ul>

        <p className="mt-10 text-slate-600 text-sm">
          {t("contract.footerNote")}
        </p>
      </article>
    </div>
  );
}
