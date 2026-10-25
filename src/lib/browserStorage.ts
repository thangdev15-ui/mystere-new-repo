/** Browser caching is optional: quota/privacy restrictions must not crash React. */
export function storeBrowserValue(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
