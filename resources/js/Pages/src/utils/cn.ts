import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Function to merge class names, including conditional logic
export function cn(...inputs: (string | Record<string, boolean>)[]) {
  return twMerge(clsx(...inputs));
}
