
import Navbar from "./components/Navbar";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/AuthContext";

export const metadata = { 
  title: "ArtPeak.Shop | Premium Customized Products & Precision Engraving",
  description: "Experience the best in customization! ArtPeak offers elite laser engraving services for wood, metal, glass, and acrylic. Shop personalized gifts, corporate branding, and unique products in India.",
  keywords: "ArtPeak, ArtPeak.shop, customized products, personalized gifts, laser engraving, custom engraving, custom wood gift, metal marking, personalized accessories India, Art Peak Shop, engraved office supplies, customized home decor, personalized corporate gifts, custom acrylic awards, wood engraving services, metal laser marking",
  openGraph: {
    title: "ArtPeak.Shop | Premium Customized Products",
    description: "Elite laser engraving services and customized products. Precision at its peak.",
    url: "https://artpeak.shop",
    siteName: "ArtPeak",
    images: [{ url: "https://artpeak.shop/og-image.jpg" }], // Encouraging OG image use
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtPeak.Shop | Custom Engraving",
    description: "Personalize your world with ArtPeak's precision laser services.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ArtPeak",
    "image": "https://artpeak.shop/logo.png",
    "@id": "https://artpeak.shop",
    "url": "https://artpeak.shop",
    "telephone": "+91-8839034632",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ArtPeak Shop",
      "addressLocality": "Madhya Pradesh",
      "addressRegion": "MP",
      "postalCode": "452001", // Approximate, user can refine
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.instagram.com/artpeak.shop" 
    ]
  };

  const productsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "ArtPeak Customized Products",
    "description": "Premium laser engraved products including wood, metal, and acrylic items.",
    "url": "https://artpeak.shop/#products",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Customized Wood Gifts"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Metal Engraved Keychains"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Personalized Acrylic Awards"
      }
    ]
  };

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Custom Manufacturing and Digital Solutions",
    "provider": {
      "@type": "LocalBusiness",
      "name": "ArtPeak.Shop"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ArtPeak Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Laser Engraving",
            "description": "High precision etching on wood, metal, glass, and acrylic."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Modern, responsive website design and development services."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Digital Marketing",
            "description": "Strategic SEO and brand growth for businesses."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Graphic Design",
            "description": "Professional branding, logo creation, and visual storytelling."
          }
        }
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
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


