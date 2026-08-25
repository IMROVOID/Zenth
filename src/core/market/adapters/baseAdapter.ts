export abstract class BaseAdapter {
  protected async fetchJson<T>(url: string, timeoutMs = 4000, customHeaders: Record<string, string> = {}): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...customHeaders
      };

      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs)
      });

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as T;
    } catch {
      return null;
    }
  }

  protected safeParseFloat(val: unknown, fallback = 0): number {
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }
}
