// 🔍 All searchable content across the website

export interface SearchItem {
    id: string;
    title: string;
    description: string;
    section: string;
    sectionLabel: string;
    href: string;
    icon: string;
    tags: string[];
}

export const searchData: SearchItem[] = [
    // ── NAV SECTIONS ──────────────────────────────────────────────────────────
    {
        id: "home",
        title: "Home",
        description: "Welcome to Art.Peak – Premium Laser Engraving & CNC Cutting",
        section: "Page",
        sectionLabel: "Page",
        href: "#home",
        icon: "🏠",
        tags: ["home", "start", "top", "artpeak", "art peak", "page", "main"],
    },
    {
        id: "services",
        title: "Services",
        description: "Explore our laser engraving and cutting services",
        section: "Page",
        sectionLabel: "Page",
        href: "#services",
        icon: "⚙️",
        tags: ["service", "services", "laser", "engraving", "cutting", "page"],
    },
    {
        id: "products",
        title: "Products",
        description: "Browse all our premium laser-engraved products",
        section: "Page",
        sectionLabel: "Page",
        href: "#products",
        icon: "🛍️",
        tags: ["products", "product", "shop", "buy", "items", "all products", "page"],
    },
    {
        id: "about",
        title: "About Us",
        description: "Art.Peak – 5+ years, 500+ projects, 100% quality commitment",
        section: "Page",
        sectionLabel: "Page",
        href: "#about",
        icon: "ℹ️",
        tags: ["about", "about us", "company", "artpeak", "team", "experience", "page"],
    },
    {
        id: "contact",
        title: "Contact",
        description: "Get in touch with us for custom projects and quotes",
        section: "Page",
        sectionLabel: "Page",
        href: "#contact",
        icon: "📱",
        tags: ["contact", "email", "phone", "reach", "message", "call", "page"],
    },

    // ── PRODUCTS ──────────────────────────────────────────────────────────────
    {
        id: "product-1",
        title: "Custom Wooden Keychain",
        description: "Personalized laser-engraved wood keychain – ₹200",
        section: "Products",
        sectionLabel: "Product",
        href: "#products",
        icon: "🗝️",
        tags: [
            "keychain", "key chain", "key", "wood", "wooden", "custom",
            "200", "₹200", "Rs 200", "personalized", "product",
            "custom wooden keychain", "wooden keychain",
        ],
    },
    {
        id: "product-2",
        title: "Metal Business Card",
        description: "Premium laser-engraved metal visiting card – ₹999",
        section: "Products",
        sectionLabel: "Product",
        href: "#products",
        icon: "💳",
        tags: [
            "metal", "business card", "card", "visiting card", "visiting",
            "999", "₹999", "Rs 999", "steel", "premium", "product",
            "metal business card", "metal card",
        ],
    },
    {
        id: "product-3",
        title: "Glass Trophy Engraving",
        description: "Custom glass trophy with precision engraving – ₹2499",
        section: "Products",
        sectionLabel: "Product",
        href: "#products",
        icon: "🏆",
        tags: [
            "glass", "trophy", "award", "engraving", "2499", "₹2499",
            "Rs 2499", "crystal", "prize", "product",
            "glass trophy", "trophy engraving", "glass engraving",
        ],
    },
    {
        id: "product-4",
        title: "Acrylic LED Logo",
        description: "Illuminated acrylic LED logo sign – ₹3999",
        section: "Products",
        sectionLabel: "Product",
        href: "#products",
        icon: "💡",
        tags: [
            "acrylic", "led", "logo", "sign", "neon", "3999", "₹3999",
            "Rs 3999", "light", "glow", "product",
            "acrylic led", "led logo", "acrylic logo", "led sign",
        ],
    },

    // ── SERVICES ──────────────────────────────────────────────────────────────
    {
        id: "service-1",
        title: "Wood Engraving",
        description: "Custom wood cutting & engraving with premium finishing",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "🪵",
        tags: [
            "wood", "wooden", "engraving", "cutting", "carving", "service",
            "wood engraving", "wooden engraving", "wood cutting",
        ],
    },
    {
        id: "service-2",
        title: "Metal Engraving",
        description: "High-precision laser marking on stainless steel & aluminum",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "⚙️",
        tags: [
            "metal", "steel", "aluminum", "stainless", "laser", "marking",
            "service", "metal engraving", "steel engraving",
        ],
    },
    {
        id: "service-3",
        title: "Glass Engraving",
        description: "Premium glass etching for gifts & branding",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "🔮",
        tags: [
            "glass", "etching", "gifts", "branding", "crystal", "service",
            "glass engraving", "glass etching",
        ],
    },
    {
        id: "service-4",
        title: "Acrylic Cutting",
        description: "Sharp & clean acrylic cutting with smooth edges",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "✂️",
        tags: [
            "acrylic", "cutting", "clean", "sharp", "edges", "service",
            "acrylic cutting", "acrylic cut",
        ],
    },
    {
        id: "service-5",
        title: "Custom Logo Engraving",
        description: "Professional business branding & logo engraving",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "🎨",
        tags: [
            "logo", "branding", "custom", "business", "design", "service",
            "logo engraving", "custom logo", "brand",
        ],
    },
    {
        id: "service-6",
        title: "Industrial CNC Cutting",
        description: "Heavy-duty CNC laser cutting for industrial projects",
        section: "Services",
        sectionLabel: "Service",
        href: "#services",
        icon: "🏭",
        tags: [
            "cnc", "industrial", "machine", "heavy", "cutting", "service",
            "cnc cutting", "industrial cutting",
        ],
    },
];

// 🔍 Smart multi-word search function
export function searchContent(query: string): SearchItem[] {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();

    // Build a flat searchable string for each item
    const score = (item: SearchItem): number => {
        const fullText = [
            item.title,
            item.description,
            ...item.tags,
            item.section,
            item.sectionLabel,
        ]
            .join(" ")
            .toLowerCase();

        // ① Exact full-phrase match → highest score
        if (item.title.toLowerCase().includes(q)) return 100;
        if (fullText.includes(q)) return 80;

        // ② All individual words must appear somewhere in fullText
        const words = q.split(/\s+/).filter(Boolean);
        const allWordsMatch = words.every((word) => fullText.includes(word));
        if (allWordsMatch) return 60;

        // ③ At least one word matches
        const anyWordMatch = words.some((word) => fullText.includes(word));
        if (anyWordMatch) return 20;

        return 0;
    };

    return searchData
        .map((item) => ({ item, s: score(item) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .map(({ item }) => item)
        .slice(0, 8);
}
