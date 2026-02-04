import { AdminFeatureFlagsForm } from "../components/AdminFeatureFlagsForm";

export default function AdminFeatureFlagsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Feature Flags</h1>
      <p className="mt-2 text-zinc-600">
        Super Admin: activează/dezactivează module și sub-features. Admin: afișează/ascunde pentru clienți. Modificările se aplică imediat (fără „în curând”).
      </p>
      <AdminFeatureFlagsForm />
    </main>
  );
}
