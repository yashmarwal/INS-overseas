import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const isVideoUrl = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
