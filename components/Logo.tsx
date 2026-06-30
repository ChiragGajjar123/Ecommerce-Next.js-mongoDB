import Image from "next/image";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="CMG"
      width={174}
      height={73}
      priority
      className={className}
    />
  );
}
