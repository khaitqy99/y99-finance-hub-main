/** Next.js getServerSideProps không cho phép `undefined` — chuyển thành `null` */
export function sanitizeForProps<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, v) => (v === undefined ? null : v)),
  ) as T;
}
