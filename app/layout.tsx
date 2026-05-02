import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x9elysium.com"),
  title: {
    default:
      "X9Elysium — Shopify Plus Consulting for Canada & United States Retailers",
    template: "%s | X9Elysium",
  },
  description:
    "Shopify Plus consulting agency serving Canadian and US retailers. Store audits, platform migrations, custom apps, and unified commerce strategy. 50+ stores delivered. 98% client retention.",
  keywords: [
    "Shopify Plus consulting",
    "Shopify Plus agency Canada",
    "Shopify Plus agency USA",
    "Shopify consulting USA",
    "Shopify consulting Canada",
    "Shopify Plus partner Toronto",
    "Shopify Plus partner New York",
    "Shopify Plus partner Los Angeles",
    "Shopify Plus partner Calgary",
    "Shopify Plus partner Vancouver",
    "Shopify migration",
    "BigCommerce to Shopify",
    "Magento to Shopify migration",
    "Shopify custom apps",
    "unified commerce",
    "ecommerce consulting",
    "Shopify Plus development",
    "DTC ecommerce agency",
    "B2B Shopify Plus",
    "Shopify integrations",
    "X9Elysium",
  ],
  authors: [{ name: "X9Elysium" }],
  alternates: {
    canonical: "/",
    languages: {
      "en-CA": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  category: "Ecommerce Consulting",
  applicationName: "X9Elysium",
  creator: "X9Elysium",
  publisher: "X9Elysium",
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title:
      "X9Elysium — Shopify Plus Consulting for Canada & United States Retailers",
    description:
      "Shopify Plus consulting agency serving Canadian and US retailers. Audits, migrations, custom apps, and unified commerce strategy.",
    type: "website",
    url: "https://x9elysium.com",
    siteName: "X9Elysium",
    locale: "en_CA",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "X9Elysium — Shopify Plus Consulting for Canada & United States Retailers",
    description:
      "Shopify Plus consulting agency serving Canadian and US retailers. Audits, migrations, custom apps, and unified commerce strategy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "CA-ON;CA-AB;CA-BC;US",
    "geo.placename": "Toronto;Calgary;Vancouver;New York;Los Angeles",
    "DC.coverage": "Canada, United States",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://x9elysium.com/#organization",
        name: "X9Elysium",
        url: "https://x9elysium.com",
        logo: "https://x9elysium.com/images/x9-logo.png",
        description:
          "Shopify Plus consulting agency serving Canadian and US retailers. Store audits, platform migrations, custom apps, and unified commerce strategy.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-604-968-6952",
          contactType: "sales",
          email: "hello@x9elysium.com",
          areaServed: ["CA", "US"],
          availableLanguage: "English",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "28 Ann Street",
          addressLocality: "Mississauga",
          addressRegion: "ON",
          postalCode: "L5G 0E1",
          addressCountry: "CA",
        },
        areaServed: [
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United States" },
        ],
        knowsAbout: [
          "Shopify Plus",
          "Shopify",
          "Unified Commerce",
          "Ecommerce Migration",
          "DTC Ecommerce",
          "B2B Ecommerce",
          "Headless Commerce",
        ],
        sameAs: [
          "https://www.instagram.com/x9elysium/",
          "https://www.facebook.com/profile.php?id=100091230745202",
          "https://linkedin.com/company/x9elysium",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://x9elysium.com/#website",
        url: "https://x9elysium.com",
        name: "X9Elysium",
        publisher: { "@id": "https://x9elysium.com/#organization" },
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://x9elysium.com/#service",
        name: "X9Elysium Shopify Plus Consulting",
        provider: { "@id": "https://x9elysium.com/#organization" },
        serviceType: [
          "Shopify Plus Store Audits",
          "Custom Shopify Apps & Integrations",
          "Platform Migrations to Shopify Plus",
          "Performance & Scaling",
          "Unified Commerce Strategy",
          "Analytics & Conversion Optimization",
        ],
        areaServed: [
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "United States" },
          { "@type": "AdministrativeArea", name: "Ontario" },
          { "@type": "AdministrativeArea", name: "Alberta" },
          { "@type": "AdministrativeArea", name: "British Columbia" },
          { "@type": "AdministrativeArea", name: "New York" },
          { "@type": "AdministrativeArea", name: "California" },
          { "@type": "AdministrativeArea", name: "Texas" },
        ],
        url: "https://x9elysium.com",
      },
    ],
  };

  return (
    <html lang="en-CA" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://embed.tawk.to" crossOrigin="" />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <div className="noise-overlay" aria-hidden="true" />
          {children}
          <Script id="tawk-to" strategy="lazyOnload">
            {`
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69d665f092b65f1c33097671/1jlmnschp';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `}
          </Script>
          {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ? (
            <Script
              id="microsoft-clarity"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `(function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`,
              }}
            />
          ) : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
