import Image from "next/image";
import { BRAND } from "@/lib/site";

type Props = {
  /** Full wordmark for header; mark-only for compact spots */
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "full",
  className = "",
  priority = false,
}: Props) {
  if (variant === "mark") {
    return (
      <Image
        src="/brand/logo-mark.png"
        alt={BRAND}
        width={32}
        height={32}
        priority={priority}
        className={`h-7 w-7 object-contain ${className}`.trim()}
      />
    );
  }

  return (
    <Image
      src="/brand/logo-header.png"
      alt={BRAND}
      width={250}
      height={72}
      priority={priority}
      className={`h-7 w-auto max-w-full object-contain object-left sm:h-8 ${className}`.trim()}
    />
  );
}
