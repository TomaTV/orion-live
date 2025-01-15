import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="icon" href="/favicon/white/favicon.ico" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    font-src 'self' fonts.gstatic.com data:;
    img-src 'self' data: https://www.gravatar.com;
    connect-src 'self' vitals.vercel-insights.com;
    frame-src 'self';
    font-src 'self' data: fonts.gstatic.com;
  "
        />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Strict-Transport-Security"
          content="max-age=31536000; includeSubDomains; preload"
        />
        <meta
          httpEquiv="Feature-Policy"
          content="geolocation 'none'; microphone 'none'; camera 'none'"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
