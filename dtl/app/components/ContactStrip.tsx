"use client";

/**
 * Persistent phone + email (from Business Settings; mock until API).
 */
export function ContactStrip({
  phone = "+40 123 456 789",
  email = "contact@service.ro",
}: {
  phone?: string;
  email?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-zinc-700 hover:text-zinc-900 underline">
        {phone}
      </a>
      <a href={`mailto:${email}`} className="text-zinc-700 hover:text-zinc-900 underline">
        {email}
      </a>
    </div>
  );
}
