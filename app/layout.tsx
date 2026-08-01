import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Work_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-source-serif",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-work-sans",
});

const ogImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/778ec05e-5b50-481a-bf36-be9fb870acfd/id-preview-c6268a59--40640a60-b76c-478c-9fb6-649bb48b196a.lovable.app-1776039275751.png";

// TODO: Set the document title to the name of your application
export const metadata: Metadata = {
  title: "AtoZ GSM",
  description: "AtoZ GSM Generated Project",
  authors: [{ name: "AtoZ GSM" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    // TODO: Update og:title to match your application name
    title: "AtoZ GSM App",
    description: " Generated Project",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AtoZ GSM",
    title: "AtoZ GSM App",
    description: "AtoZ GSM Generated Project",
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${workSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
