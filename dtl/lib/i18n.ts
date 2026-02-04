/**
 * i18n: Romanian for v1; structure ready for future locales.
 * Strings externalized by namespace/screen.
 */

export const locale = "ro" as const;

export type Namespace = "common" | "home" | "servicii" | "programare" | "contact" | "cont" | "admin";

const ro: Record<Namespace, Record<string, string>> = {
  common: {
    home: "Acasă",
    services: "Servicii",
    booking: "Programare",
    contact: "Contact",
    myAccount: "Contul meu",
    cardInstallmentBanner: "Plătiți cu cardul în rate la service.",
  },
  home: {
    title: "Service auto",
    heroTitle: "Bun venit",
    heroSubtitle: "Service complet pentru vehiculul dvs.",
    generalService: "Service general",
    tyreService: "Anvelope",
    carWash: "Spălătorie",
  },
  servicii: {
    title: "Servicii",
    listDescription: "Lista serviciilor va fi afișată aici.",
    requestAppointment: "Solicită programare",
  },
  programare: {
    title: "Programare",
    formDescription: "Formularul de programare va fi afișat aici.",
    tabGeneral: "Service",
    tabTyre: "Anvelope",
    tabWash: "Spălătorie",
  },
  contact: {
    title: "Contact",
    description: "Informații de contact și hartă vor fi afișate aici.",
  },
  cont: {
    title: "Contul meu",
    description: "Programări și facturi vor fi afișate aici după autentificare.",
  },
  admin: {
    dashboard: "Dashboard",
    calendar: "Calendar",
    appointments: "Programări",
    settings: "Setări",
    featureFlags: "Feature Flags",
    services: "Servicii",
    users: "Utilizatori",
    content: "Conținut",
    login: "Login",
  },
};

export function t(namespace: Namespace, key: string): string {
  const ns = ro[namespace];
  return ns?.[key] ?? key;
}

export function getNamespace(ns: Namespace): Record<string, string> {
  return ro[ns] ?? {};
}
