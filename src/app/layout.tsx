import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | VShop",
    default: "VShop | Tu tienda online",
  },
  description:
    "Encuentra lo que buscas al mejor precio. Envíos a todo el país, pagos seguros y la mejor atención.",
  keywords: [
    "e-commerce",
    "tienda online",
    "compras",
    "tecnología",
    "moda",
    "hogar",
  ],
  authors: [{ name: "VShop Team" }],
  openGraph: {
    title: "VShop | Tu tienda online",
    description:
      "Encuentra lo que buscas al mejor precio. Envíos a todo el país.",
    type: "website",
    locale: "es_AR",
    siteName: "VShop",
  },
  twitter: {
    card: "summary_large_image",
    title: "VShop | Tu tienda online",
    description: "Encuentra lo que buscas al mejor precio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VShop",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://vshop.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://vshop.com"}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD injection is standard practice
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
