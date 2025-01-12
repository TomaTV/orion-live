import "@/styles/globals.css";
import { useSmoothScroll } from "@/components/hooks/useSmoothScroll";

export default function MyApp({ Component, pageProps }) {
  useSmoothScroll();
  return <Component {...pageProps} />;
}
