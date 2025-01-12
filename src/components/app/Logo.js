import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-x-3">
      <div className="relative">
        <Image
          src="/img/logo.png"
          alt="Logo Orion"
          width={40}
          height={40}
          priority
          className="invert"
        />
      </div>
      <span className="text-2xl font-bold text-black font-spaceg">Orion</span>
    </Link>
  );
}
