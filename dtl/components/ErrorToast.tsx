"use client";

import { t } from "@/lib/i18n";

export interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4 shadow-lg sm:left-auto"
      role="alert"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-red-800">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 text-red-600 hover:bg-red-100"
          aria-label={t("common.close")}
        >
          ×
        </button>
      </div>
    </div>
  );
}
