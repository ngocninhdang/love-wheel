import crypto from "crypto";

export function generateShareCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

const SEGMENT_COLORS = [
  "#E11D48", // rose-600
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
  "#A855F7", // purple-500
  "#EF4444", // red-500
  "#14B8A6", // teal-500
  "#F472B6", // pink-400
];

export function getSegmentColor(index: number): string {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length];
}
