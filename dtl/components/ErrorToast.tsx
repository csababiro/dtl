interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800"
      role="alert"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="px-2 py-1 text-red-600 hover:bg-red-100 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Închide"
      >
        ×
      </button>
    </div>
  );
}
