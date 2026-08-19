export function readText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function readBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function readList(value: unknown, fallback: string[]) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function getInitials(value: string) {
  return value
    .split(/\s+|@/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
