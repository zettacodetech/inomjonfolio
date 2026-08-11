import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/800.css";
import "@fontsource/playfair-display/900.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { AppChrome } from "@/components/AppChrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://inomjonfolio-production.up.railway.app"),
  title: "Inomjon Toshmirzayev | Backend Developer",
  description:
    "Backend Developer building modern APIs and web platforms with Python, FastAPI, Django, and PostgreSQL.",
  authors: [{ name: "Inomjon Toshmirzayev", url: "https://inomjonfolio-production.up.railway.app" }],
  creator: "Inomjon Toshmirzayev",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Inomjon Toshmirzayev | Backend Developer",
    description: "Backend Developer from Uzbekistan.",
    url: "https://inomjonfolio-production.up.railway.app",
    siteName: "Inomjon Toshmirzayev",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Inomjon Toshmirzayev — Backend Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inomjon Toshmirzayev | Backend Developer",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        }}
        className="antialiased"
      >
        <ThemeProvider>
          <LanguageProvider>
            <AppChrome>{children}</AppChrome>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
