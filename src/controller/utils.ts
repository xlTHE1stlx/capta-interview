import { Temporal as tp } from "@js-temporal/polyfill";

export const time: tp.Instant = tp.Now.instant();

export function isInteger(value: unknown): boolean {
  return Number.isInteger(Number(value));
}

export function isPositive(value: unknown): boolean {
  return isInteger(value) && Number(value) > 0;
}

export function validDate(value: string): boolean {
  const iso8601Regex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?/;
  
  if (!iso8601Regex.test(value)) {
    return false;
  }
  
  try {
    const testDate: Date = new Date(value);
    return !isNaN(testDate.getTime());
  } catch {
    return false;
  }
}