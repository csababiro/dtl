import { getNamespace } from "@/lib/i18n";
import { ProgramareForm } from "../components/ProgramareForm";

export default function ProgramarePage() {
  const programare = getNamespace("programare");

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">{programare.title}</h1>
      <ProgramareForm />
    </main>
  );
}
