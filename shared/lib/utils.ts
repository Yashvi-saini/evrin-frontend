export function cn(...inputs: (string | undefined | null | false | Record<string, boolean> | (string | undefined | null | false)[])[]) {
  const result: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      result.push(input);
    } else if (Array.isArray(input)) {
      for (const item of input) {
        if (item && typeof item === 'string') {
          result.push(item);
        }
      }
    } else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) result.push(key);
      }
    }
  }

  return result.join(' ');
}

export function formatNumber(val: number, decimals: number = 1): string {
  if (isNaN(val)) return '—';
  return val.toFixed(decimals);
}

export function formatRainfall(mm: number): string {
  if (isNaN(mm)) return '— mm';
  return `${mm.toFixed(1)} mm`;
}

export function formatPercentage(ratio: number): string {
  if (isNaN(ratio)) return '—%';
  return `${Math.round(ratio * 100)}%`;
}
