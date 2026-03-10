import Navbar from "./components/Navbar";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/AuthContext";

const SITE_URL = "https://artpeak.shop";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ArtPeak.Shop | Best Laser Engraving India | Custom Gifts & Engraved Products",
    template: "%s | ArtPeak.Shop",
  },
  description: "India's #1 laser engraving shop. Custom wooden keychains, metal engraving, acrylic trophies, personalized gifts. Order online - ArtPeak.shop. Free shipping. 500+ projects. Indore, MP.",
  keywords: [
    "ArtPeak",
    "ArtPeak.shop",
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
    "web development Indore",
    "digital marketing India",
    "customized home decor",
    "laser marking India",
  ],
  authors: [{ name: "ArtPeak.Shop", url: SITE_URL }],
  creator: "ArtPeak.Shop",
  publisher: "ArtPeak.Shop",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ArtPeak.Shop | Laser Engraving India | Custom Gifts & Engraved Products",
    description: "Premium laser engraving on wood, metal, glass, acrylic. Personalized gifts, corporate branding. 500+ projects. Order at artpeak.shop",
    url: SITE_URL,
    siteName: "ArtPeak.Shop",
    images: [
      { url: "/images/logo/logo.png", width: 512, height: 512, alt: "ArtPeak.Shop - Laser Engraving & Customized Products India" },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtPeak.Shop | Best Laser Engraving India",
    description: "Custom wooden keychains, metal engraving, personalized gifts. Order at artpeak.shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    // Add your verification codes when you have them:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
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
    "name": "ArtPeak.Shop",
    "alternateName": ["ArtPeak", "Art Peak Shop"],
    "description": "India's premium laser engraving shop. Custom wooden keychains, metal engraving, acrylic trophies, personalized gifts, corporate branding. Indore, MP.",
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
    "sameAs": ["https://www.instagram.com/artpeak.shop"],
    "knowsAbout": ["Laser Engraving", "Custom Gifts", "Wood Engraving", "Metal Engraving", "Acrylic Cutting", "Personalized Products"]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://artpeak.shop/#website",
    "name": "ArtPeak.Shop",
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


