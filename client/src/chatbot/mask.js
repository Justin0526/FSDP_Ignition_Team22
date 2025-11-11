// Mask all but last 4 digits; preserves spaces if you want, but we normalize first
export function maskNumber(value) {
  const raw = String(value).replace(/\s+/g, "");
  return raw.replace(/\d(?=\d{4})/g, "*");
}
