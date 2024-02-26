import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const baseUrl: string = "https://api-v2-sandbox.chimoney.io";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
