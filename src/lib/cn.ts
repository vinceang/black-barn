/** Join conditional class names. Small on purpose — §3.4 has a 180KB budget. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
