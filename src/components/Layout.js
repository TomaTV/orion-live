import Header from "./Header";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-orion-dark-bg">
      {/* Gradient global */}
      <div className="fixed inset-0 z-20 h-[120vh]">
        <Image
          src="/img/gradient.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <Header />

      {/* Contenu principal */}
      <main className="relative z-40">{children}</main>
    </div>
  );
}
