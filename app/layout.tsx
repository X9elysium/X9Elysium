import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://x9elysium.com"),
  title: "X9Elysium — Shopify Commerce Consulting",
  description:
    "Shopify unified commerce consulting for retailers ready to scale. Store audits, custom apps, platform migrations, and commerce strategy.",
  keywords: [
    "Shopify",
    "unified commerce",
    "ecommerce consulting",
    "Shopify Plus",
    "store optimization",
    "custom integrations",
    "platform migration",
    "X9Elysium",
  ],
  authors: [{ name: "X9Elysium" }],
  icons: {
    icon: "/images/favicon.png",
  },
  openGraph: {
    title: "X9Elysium — Shopify Commerce Consulting",
    description:
      "Shopify unified commerce consulting for retailers ready to scale. Store audits, custom apps, platform migrations, and commerce strategy.",
    type: "website",
    url: "https://x9elysium.com",
    siteName: "X9Elysium",
  },
  twitter: {
    card: "summary_large_image",
    title: "X9Elysium — Shopify Commerce Consulting",
    description:
      "Shopify unified commerce consulting for retailers ready to scale. Store audits, custom apps, platform migrations, and commerce strategy.",
  },
  robots: {
    index: true,
    follow: true,
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
          "Shopify unified commerce consulting for retailers ready to scale. Store audits, custom apps, platform migrations, and commerce strategy.",
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
        name: "X9Elysium Shopify Consulting",
        provider: { "@id": "https://x9elysium.com/#organization" },
        serviceType: [
          "Store Optimization & Audits",
          "Custom Apps & Integrations",
          "Platform Migrations",
          "Performance & Scaling",
          "Strategy Consulting",
          "Analytics & Reporting",
        ],
        areaServed: ["CA", "US"],
        url: "https://x9elysium.com",
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-black text-white">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
        <Script id="tawk-to" strategy="afterInteractive">
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
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`,
          }}
        />
      </body>
    </html>
  );
}
