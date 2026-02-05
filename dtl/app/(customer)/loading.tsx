import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function CustomerLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
