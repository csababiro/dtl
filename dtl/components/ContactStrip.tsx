/**
 * Contact strip – phone and email prominent. Same on all customer pages.
 * Values from Business Settings (props or mock).
 */
export default function ContactStrip({
  phone = "—",
  email = "—",
}: {
  phone?: string;
  email?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <a href={phone.startsWith("tel:") ? phone : `tel:${phone}`} className="font-medium">
        Tel: {phone}
      </a>
      <a href={email.startsWith("mailto:") ? email : `mailto:${email}`} className="font-medium">
        Email: {email}
      </a>
    </div>
  );
}
