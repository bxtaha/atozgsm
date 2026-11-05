import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Work_Sans } from "next/font/google";
import { Providers } from "./providers";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { TierToggle } from "@/components/preview/TierToggle";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";
import { SITE_URL } from "@/lib/site-config";
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

const DESCRIPTION =
  "ATOZ GSM helps Bangladeshi students study in China — compare university tuition and hostel costs, understand scholarship and visa requirements, and get step-by-step application support from Dhaka.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ATOZ GSM — Study in China from Bangladesh",
    template: "%s | ATOZ GSM",
  },
  description: DESCRIPTION,
  authors: [{ name: "ATOZ GSM" }],
  icons: { icon: "/favicon.ico" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "ATOZ GSM — Study in China from Bangladesh",
    description: DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: "ATOZ GSM",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATOZ GSM — Study in China from Bangladesh",
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
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
    <html lang="en" suppressHydrationWarning className={`${sourceSerif.variable} ${workSans.variable}`}>
      <body>
        <OrganizationSchema />
        <MetaPixel />
        <Providers>{children}</Providers>
        <VoiceAssistant />
        {process.env.NEXT_PUBLIC_SHOW_TIER_TOGGLE === "true" && <TierToggle />}
      </body>
    </html>
  );
}
