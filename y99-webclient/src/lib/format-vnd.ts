/** Deterministic VND display — avoids Node vs browser `toLocaleString` hydration mismatches. */
export function formatVnd(amount: number): string {
  const grouped = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped} đ`;
}
