export function normalizeAddress(location: string, plz: string): string {
  const trimmedLocation = location.trim().toLowerCase();
  const trimmedPlz = plz.trim();

  if (trimmedPlz) {
    return `${trimmedLocation}, ${trimmedPlz} berlin, germany`;
  }
  return `${trimmedLocation}, berlin, germany`;
}
