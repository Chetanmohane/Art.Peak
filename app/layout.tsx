import Navbar from "./components/Navbar";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/AuthContext";

const SITE_URL = "https://artpeak.shop";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ArtPeak | Best Laser Engraving India | Custom Gifts & Engraved Products",
    template: "%s | ArtPeak.Shop",
  },
  description: "ArtPeak is India's premier laser engraving shop. Shop custom wooden keychains, metal engraving, acrylic trophies, and personalized gifts. Best prices, free shipping, and 500+ successful projects. Order online at ArtPeak.shop.",
  keywords: [
    "ArtPeak",
    "Art Peak",
    "ArtPeak.shop",
    "ArtPeak Indore",
    "ArtPeak India",
    "artpeak shop",
    "laser engraving India",
    "laser engraving Indore",
    "custom engraving India",
    "personalized gifts India",
    "wooden keychain India",
    "custom wooden keychain",
    "metal engraving",
    "acrylic engraving",
    "glass engraving",
    "corporate gifts India",
    "personalized corporate gifts",
    "customized products India",
    "laser cutting services",
    "engraved keychains",
    "name plate engraving",
    "trophy engraving",
    "custom logo engraving",
    "Art Peak Shop",
    "Chetan Mohane ArtPeak",
    "customized home decor",
    "laser marking India",
  ],
  authors: [{ name: "ArtPeak.Shop", url: SITE_URL }],
  creator: "ArtPeak.Shop",
  publisher: "ArtPeak.Shop",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/images/logo/logo.png",
      },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ArtPeak | Laser Engraving India | Custom Gifts & Engraved Products",
    description: "Premium laser engraving on wood, metal, glass, acrylic. Personalized gifts, corporate branding. Shop at ArtPeak.shop for high-quality customized products.",
    url: SITE_URL,
    siteName: "ArtPeak",
    images: [
      { url: "/images/logo/logo.png", width: 512, height: 512, alt: "ArtPeak - Laser Engraving & Customized Products India" },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtPeak | Best Laser Engraving India",
    description: "Custom wooden keychains, metal engraving, personalized gifts. Shop high-quality engraved products at ArtPeak.shop",
    images: ["/images/logo/logo.png"],
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
  verification: {
    google: "ZB9R-vKHDg-GcGI19pVfPptsh8_OQEUkuW52jlEuIF0",
  },
  category: "Shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://artpeak.shop/#business",
    "name": "ArtPeak",
    "alternateName": ["ArtPeak.Shop", "Art Peak Shop", "ArtPeak Laser Engraving"],
    "description": "ArtPeak is India's premium laser engraving shop. We specialize in custom wooden keychains, metal engraving, acrylic trophies, personalized gifts, and corporate branding. Based in Indore, MP, serving all India.",
    "url": "https://artpeak.shop",
    "logo": "https://artpeak.shop/images/logo/logo.png",
    "image": ["https://artpeak.shop/images/logo/logo.png", "https://artpeak.shop/og-image.jpg"],
    "telephone": "+91-8839034632",
    "email": "info@artpeak.shop",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ArtPeak Shop",
      "addressLocality": "Indore",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN",
      "postalCode": "452001"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.7196,
      "longitude": 75.8577
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "₹₹",
    "sameAs": ["https://www.instagram.com/art.peak_/"],
    "knowsAbout": ["Laser Engraving", "Custom Gifts", "Wood Engraving", "Metal Engraving", "Acrylic Cutting", "Personalized Products"]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://artpeak.shop/#website",
    "name": "ArtPeak",
    "alternateName": ["Art Peak", "ArtPeak.shop", "Art Peak Shop"],
    "url": "https://artpeak.shop",
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": "https://artpeak.shop/#products?q={search_term_string}" },
      "query-input": "required name=search_term_string"
    },
    "publisher": { "@id": "https://artpeak.shop/#business" }
  };

  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "ArtPeak Customized Products - Laser Engraved Gifts India",
    "description": "Shop laser engraved wooden keychains, metal engraving, acrylic awards, personalized gifts. Best custom engraving in India.",
    "url": "https://artpeak.shop/#products",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Customized Wooden Keychains" },
      { "@type": "ListItem", "position": 2, "name": "Metal Engraved Keychains & Name Plates" },
      { "@type": "ListItem", "position": 3, "name": "Personalized Acrylic Awards & Trophies" },
      { "@type": "ListItem", "position": 4, "name": "Glass Engraving & Corporate Gifts" },
      { "@type": "ListItem", "position": 5, "name": "Custom Logo Engraving Services" }
    ]
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Laser Engraving & Custom Manufacturing",
    "provider": { "@id": "https://artpeak.shop/#business" },
    "name": "ArtPeak Laser Engraving Services",
    "description": "Laser engraving on wood, metal, glass, acrylic. Web development, digital marketing, graphic design. Indore, India.",
    "areaServed": { "@type": "Country", "name": "India" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ArtPeak Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laser Engraving", "description": "High precision wood, metal, glass, acrylic engraving" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Development", "description": "Next.js, React web development India" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Digital Marketing", "description": "SEO, PPC, social media marketing" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphic Design", "description": "Logo, branding, visual design" } }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="geo.region" content="IN-MP" />
        <meta name="geo.placename" content="Indore" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
      </head>
      <body>
        <AuthContext>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </ThemeProvider>
        </AuthContext>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}


//Pymenth Method 


