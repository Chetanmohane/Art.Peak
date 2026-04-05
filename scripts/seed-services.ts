import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

const services = [
  {
    title: "Laser Engraving",
    desc: "Precision engraving on multiple materials with high-tech machinery.",
    longDesc: "Expert laser etching on wood, metal, glass, and acrylic. Perfect for personalized awards, gifts, and industrial marking.",
    iconName: "Hammer",
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
    features: JSON.stringify(["Custom Designs", "Multi-Material", "Precision Accuracy"])
  },
  {
    title: "Web Developer",
    desc: "Modern and professional website development using latest technologies.",
    longDesc: "Full-stack web development specializing in Next.js, React, and Node.js. We build lightning-fast, SEO-optimized, and scalable web apps.",
    iconName: "Cpu",
    tag: "Digital",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
    features: JSON.stringify(["Next.js/React", "Custom CMS", "Responsive Design"])
  },
  {
    title: "Digital Marketing",
    desc: "Strategic marketing campaigns to grow your brand and reach new customers.",
    longDesc: "Comprehensive digital strategies including SEO, PPC, and social media management to maximize your online footprint and ROI.",
    iconName: "Zap",
    tag: "Growth",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    features: JSON.stringify(["SEO Strategies", "Social Ads", "Email Marketing"])
  },
  {
    title: "Graphic Designer",
    desc: "Stunning visual designs that speak your brand's unique story.",
    longDesc: "High-quality creative services for branding, logos, print media, and digital assets that capture attention and leave an impression.",
    iconName: "PenTool",
    tag: "Creative",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800",
    features: JSON.stringify(["Logo Design", "Branding", "Illustrations"])
  },
  {
    title: "UI/UX Design",
    desc: "User-centric design focused on intuitive and beautiful user journeys.",
    longDesc: "Crafting seamless user experiences and professional interfaces to ensure your product is as functional as it is aesthetic.",
    iconName: "Layers",
    tag: "Modern",
    image: "https://images.unsplash.com/photo-1541462608141-ad4d157ee9f8?q=80&w=800",
    features: JSON.stringify(["Figma Experts", "User Testing", "Prototyping"])
  },
  {
    title: "App Development",
    desc: "High-performance mobile applications for iOS and Android.",
    longDesc: "Building native and cross-platform mobile apps that provide a smooth user experience and high functionality on all devices.",
    iconName: "Sparkles",
    tag: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800",
    features: JSON.stringify(["iOS & Android", "Native Performance", "Push Notifications"])
  }
];

async function main() {
    console.log("🚀 Seeding services to MongoDB...");
    
    // Clear existing services to avoid duplicates
    await prisma.service.deleteMany();
    
    for (const service of services) {
        await prisma.service.create({
            data: service
        });
        console.log(`✅ Seeded: ${service.title}`);
    }
    
    console.log("🎉 Successfully seeded all services!");
    await prisma.$disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
});
