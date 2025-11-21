import { onCLS, onFID, onLCP } from 'web-vitals';

export function reportWebVitals(callback = console.log) {
  try {
    onCLS(callback);
    onFID(callback);
    onLCP(callback);
  } catch (e) {
    // ignore in test environments
  }
}
