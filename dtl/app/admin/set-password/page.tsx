import { Suspense } from "react";
import { SetPasswordClient } from "./SetPasswordClient";

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="text-white">Se încarcă...</div>
        </div>
      }
    >
      <SetPasswordClient />
    </Suspense>
  );
}
