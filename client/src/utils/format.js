export function truncate(str, len = 20) {
  if (str.length <= len) return str;
  return str.slice(0, len) + '…';
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
