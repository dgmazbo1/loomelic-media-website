/**
 * CarMakerLogo — renders a stylized car brand badge.
 * Falls back to the first two letters of the brand name when no logo image is available.
 */

import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

// Brand-specific accent colours (OKLCH-safe hex fallbacks)
const brandColors: Record<string, string> = {
  toyota: "#EB0A1E",
  lexus: "#1A1A1A",
  honda: "#CC0000",
  ford: "#003478",
  chevrolet: "#D1A23A",
  bmw: "#0066B1",
  mercedes: "#333333",
  audi: "#BB0A30",
  nissan: "#C3002F",
  hyundai: "#002C5F",
  kia: "#05141F",
  subaru: "#013B7A",
  volkswagen: "#001E50",
  mazda: "#910B31",
  jeep: "#2E4A2E",
  dodge: "#BA0C2F",
  ram: "#000000",
  gmc: "#CC0000",
  buick: "#8C8C8C",
  cadillac: "#A67C52",
  chrysler: "#003366",
  acura: "#1B1B1B",
  infiniti: "#1A1A1A",
  volvo: "#003057",
  porsche: "#B12B28",
  jaguar: "#461D1A",
  "land rover": "#005A2B",
  tesla: "#CC0000",
  rivian: "#F5A623",
  lucid: "#4A4A4A",
  genesis: "#1A1A1A",
};

function getColor(brand: string) {
  const key = brand.toLowerCase().trim();
  return brandColors[key] ?? "#6366f1"; // indigo fallback
}

function getInitials(brand: string) {
  const words = brand.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return brand.slice(0, 2).toUpperCase();
}

interface CarMakerLogoProps {
  brand: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CarMakerLogo({ brand, size = "md", className }: CarMakerLogoProps) {
  const color = getColor(brand);
  const initials = getInitials(brand);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md font-bold text-white select-none shrink-0",
        sizeMap[size],
        className,
      )}
      style={{ backgroundColor: color }}
      title={brand}
    >
      {initials}
    </div>
  );
}
