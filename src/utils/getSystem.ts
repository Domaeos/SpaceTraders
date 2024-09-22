export default function getSystem(symbol: string) {
  const systemRegex = /^[^-]+-[^-]+(?=-)/;
  const [system] = symbol?.match(systemRegex) ?? "";
  return system;
}