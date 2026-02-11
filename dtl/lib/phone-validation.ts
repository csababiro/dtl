/**
 * Shared phone validation: digits, spaces, hyphen, plus only.
 * Use for register, booking, cerere ofertă, and profile phone fields.
 */

export const PHONE_PATTERN = /^[\d\s\-+]*$/;

export function phoneFilter(value: string): string {
  return value.replace(/[^\d\s\-+]/g, "");
}

/** Options for react-hook-form register("phone", options). Pass required and pattern messages from i18n. */
export function phoneRegisterOptions(
  requiredMessage: string,
  patternMessage: string
): { required: string; pattern: { value: RegExp; message: string } } {
  return {
    required: requiredMessage,
    pattern: { value: PHONE_PATTERN, message: patternMessage },
  };
}

/** Wrap register() result so input is filtered to allowed chars on change. */
export function withPhoneFilter<T extends { ref: unknown; onChange: (e: { target: { value: string } }) => void }>(
  registered: T
): T {
  const { onChange, ...rest } = registered;
  return {
    ...rest,
    onChange: (e: { target: { value: string } }) => {
      e.target.value = phoneFilter(e.target.value);
      onChange(e);
    },
  } as T;
}

/** Car year: up to 4 digits only. */
export const YEAR_PATTERN = /^\d{0,4}$/;

export function yearFilter(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

const MIN_YEAR = 1980;

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** Returns error message if year is not in [1980, currentYear], else undefined. */
export function validateYearRange(yearStr: string): string | undefined {
  if (!yearStr.trim()) return undefined;
  const y = parseInt(yearStr.trim(), 10);
  if (Number.isNaN(y) || y < MIN_YEAR || y > getCurrentYear()) return "carYearRange";
  return undefined;
}

export function withYearFilter<T extends { ref: unknown; onChange: (e: { target: { value: string } }) => void }>(
  registered: T
): T {
  const { onChange, ...rest } = registered;
  return {
    ...rest,
    onChange: (e: { target: { value: string } }) => {
      e.target.value = yearFilter(e.target.value);
      onChange(e);
    },
  } as T;
}
