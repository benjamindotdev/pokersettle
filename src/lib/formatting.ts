/** Convert a euro amount (number, possibly fractional) to integer cents. */
export function eurosToCents(euros: number): number {
  if (!Number.isFinite(euros)) return 0;
  return Math.round(euros * 100);
}

/** Convert integer cents back to euros. */
export function centsToEuros(cents: number): number {
  return cents / 100;
}

/** Format an integer cents value as a EUR currency string, e.g. €12.50. */
export function formatCents(cents: number, currency: "EUR" = "EUR"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const value = (abs / 100).toFixed(2);
  const symbol = currency === "EUR" ? "€" : currency;
  return `${sign}${symbol}${value}`;
}

/** Format with explicit + for positives (used for net display). */
export function formatCentsSigned(cents: number, currency: "EUR" = "EUR"): string {
  if (cents > 0) return `+${formatCents(cents, currency)}`;
  return formatCents(cents, currency);
}
