import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const ogImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/778ec05e-5b50-481a-bf36-be9fb870acfd/id-preview-c6268a59--40640a60-b76c-478c-9fb6-649bb48b196a.lovable.app-1776039275751.png";

// TODO: Set the document title to the name of your application
export const metadata: Metadata = {
  title: "Lovable App",
  description: "Lovable Generated Project",
  authors: [{ name: "Lovable" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    // TODO: Update og:title to match your application name
    title: "Lovable App",
    description: "Lovable Generated Project",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "Lovable App",
    description: "Lovable Generated Project",
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
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
