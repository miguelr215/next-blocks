import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDatetoYYYYMMDD(date: Date) {
	const year = date.getFullYear();
	// getMonth() is 0-indexed, so add 1
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	// console.log(`formatted date: ${year}${month}${day}`);
	return `${year}${month}${day}`;
}
