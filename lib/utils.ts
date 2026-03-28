import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class strings into one.
 *
 * @param inputs
 * @returns A combined string of classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object into a YYYYMMDD string.
 *
 * @param date
 * @returns A string of a formatted date
 */
export function formatDatetoYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  // getMonth() is 0-indexed, so add 1
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // console.log(`formatted date: ${year}${month}${day}`);
  return `${year}${month}${day}`;
}

/**
 * Formats a numeric string into a USD currency string with commas and two decimal places.
 *
 * @param value - The numeric string to format (e.g. "1234567.8")
 * @returns A formatted currency string (e.g. "$1,234,567.80")
 * @throws {Error} When the provided string is not a valid number
 *
 * @example
 * ```typescript
 * formatCurrency("1234567.89"); // "$1,234,567.89"
 * formatCurrency("1000");       // "$1,000.00"
 * formatCurrency(".5");         // "$0.50"
 * ```
 */
export function formatCurrency(value: string): string {
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    throw new Error(`Invalid numeric string: "${value}"`);
  }

  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Finds the ordinal suffix for a given number.
 *
 * @param n - The number to find the ordinal suffix for
 * @returns The ordinal suffix (e.g. "st", "nd", "rd", "th")
 */
export function getOrdinalSuffix(n: number): string {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
