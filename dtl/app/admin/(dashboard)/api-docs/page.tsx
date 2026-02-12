"use client";

import dynamic from "next/dynamic";
import { t } from "@/lib/i18n";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-slate-900 p-4 border-b">
        {t("admin.apiDocs") || "API Docs (Swagger)"}
      </h1>
      <div className="swagger-wrapper">
        <SwaggerUI url="/api/openapi" />
      </div>
    </div>
  );
}
