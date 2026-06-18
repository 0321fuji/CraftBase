export function normalizeFontSize(value, fallback) {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return fallback;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}px`;
  }

  if (/^\d+(\.\d+)?(px|rem|em|%|vw|vh)$/.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}
