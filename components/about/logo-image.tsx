import Image from "next/image";
import type { Logo } from "@/lib/about";

/**
 * A deck logo at most `maxHeight` tall and `maxWidth` wide, and never larger
 * than the image the deck carries, since these were extracted at print size.
 */
export default function LogoImage({ logo, maxHeight, maxWidth, className = "" }: { logo: Logo; maxHeight: number; maxWidth: number; className?: string }) {
  const scale = Math.min(1, maxHeight / logo.height, maxWidth / logo.width);
  const width = Math.round(logo.width * scale);
  const height = Math.round(logo.height * scale);
  return <Image src={logo.src} alt={logo.alt} width={width} height={height} className={`block h-auto max-w-full ${className}`} style={{ width, height }} />;
}
