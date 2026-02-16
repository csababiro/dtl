import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminFeatureFlagsClient } from "@/components/admin/AdminFeatureFlagsClient";
import { getFeatureFlags } from "@/lib/services/feature-flags";
import { DEFAULT_FEATURE_FLAGS, featureFlagsToToggles } from "@/lib/feature-flags";
import { JWT_COOKIE, verifyJwt } from "@/lib/auth/jwt";

export const dynamic = "force-dynamic";

export default async function AdminFeatureFlagsPage() {
  const cookieStore = await cookies();
  const jwtToken = cookieStore.get(JWT_COOKIE)?.value;
  const payload = jwtToken ? await verifyJwt(jwtToken) : null;
  if (!payload || payload.role !== "super_admin") {
    redirect("/admin");
  }
  const result = await getFeatureFlags();
  const flags = "data" in result ? result.data : DEFAULT_FEATURE_FLAGS;
  const initialToggles = featureFlagsToToggles({ ...DEFAULT_FEATURE_FLAGS, ...flags });
  return <AdminFeatureFlagsClient initialToggles={initialToggles} />;
}
