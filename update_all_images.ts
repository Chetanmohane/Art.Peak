import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const updates = [
    {
        name: "Customised Pen (Engraved)",
        image: "https://m.media-amazon.com/images/I/61p-L824+uL._SL1200_.jpg",
        images: [
            "https://cms.cloudinary.vpsvc.com/image/upload/f_auto,q_auto:best,dpr_1.0/India%20LOB/Pens/Personalised%20Sleek%20Pens/IN_Sleek-Pens_001",
            "https://m.media-amazon.com/images/I/61p-L824+uL._SL1200_.jpg"
        ]
    },
    {
        name: "Wooden Mandir / Temple Showpiece",
        image: "https://m.media-amazon.com/images/I/71Y8T1jL+PL._SL1500_.jpg",
        images: [
            "https://m.media-amazon.com/images/I/71Y8T1jL+PL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71+vCIBE3kL._SL1500_.jpg"
        ]
    },
    {
        name: "Kids DIY Painting Kit",
        image: "https://m.media-amazon.com/images/I/71qYx5tV-GL._SL1500_.jpg",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2023/10/356106606/OX/OX/OX/10234123/diy-art-painting-kit-for-kids-500x500.jpg",
            "https://m.media-amazon.com/images/I/71qYx5tV-GL._SL1500_.jpg"
        ]
    },
    {
        name: "Customised Name Keychain",
        image: "https://m.media-amazon.com/images/I/61S+jE4nRAL._SL1100_.jpg",
        images: [
            "https://m.media-amazon.com/images/I/61S+jE4nRAL._SL1100_.jpg",
            "https://m.media-amazon.com/images/I/71d-72NfLNL._SL1500_.jpg"
        ]
    },
    {
        name: "Customised Photo Keychain",
        image: "https://m.media-amazon.com/images/I/71YFpP1k6yL._SL1500_.jpg",
        images: [
            "https://m.media-amazon.com/images/I/71YFpP1k6yL._SL1500_.jpg",
            "https://m.media-amazon.com/images/I/61Y-F7X+WYL._SL1500_.jpg"
        ]
    },
    {
        name: "Wooden Photo Lamp",
        image: "https://m.media-amazon.com/images/I/71Y-XoYl1fL._SL1500_.jpg",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2021/4/XP/RR/EM/25447101/personalized-rotating-photo-lamp-500x500.jpg",
            "https://m.media-amazon.com/images/I/71Y-XoYl1fL._SL1500_.jpg"
        ]
    },
    {
        name: "Custom Wooden Keychain",
        image: "https://i.etsystatic.com/19080537/r/il/64c39f/2119044234/il_1588xN.2119044234_7yqr.jpg",
        images: [
            "https://i.etsystatic.com/19080537/r/il/64c39f/2119044234/il_1588xN.2119044234_7yqr.jpg",
            "https://m.media-amazon.com/images/I/61jC7Klvf9L._SL1100_.jpg"
        ]
    },
    {
        name: "Metal Business Card",
        image: "https://tapmo.in/cdn/shop/files/TapMoMetalNFCBusinessCardsBlackMetal_1000x.jpg",
        images: [
            "https://tapmo.in/cdn/shop/files/TapMoMetalNFCBusinessCardsBlackMetal_1000x.jpg",
            "https://print-on-click.in/wp-content/uploads/2021/04/Silver-Metal-Visiting-Card.jpg"
        ]
    },
    {
        name: "Glass Trophy Engraving",
        image: "https://5.imimg.com/data5/SELLER/Default/2021/3/YK/XG/QJ/12431413/3d-laser-engraved-crystal-award-trophy-500x500.jpg",
        images: [
            "https://5.imimg.com/data5/SELLER/Default/2021/3/YK/XG/QJ/12431413/3d-laser-engraved-crystal-award-trophy-500x500.jpg",
            "https://i.etsystatic.com/26485098/r/il/263595/3277084534/il_1588xN.3277084534_8yqr.jpg"
        ]
    },
    {
        name: "Acrylic LED Logo",
        image: "https://nameplateshop.com/wp-content/uploads/2023/06/Unique-Reception-Wall-Acrylic-LED-Logo-Plate-3.jpg",
        images: [
            "https://nameplateshop.com/wp-content/uploads/2023/06/Unique-Reception-Wall-Acrylic-LED-Logo-Plate-3.jpg",
            "https://m.media-amazon.com/images/I/71u-iF4-pOL._SL1500_.jpg"
        ]
    },
    {
        name: "Premium Desktop Nameplate",
        image: "https://m.media-amazon.com/images/I/61U77zE4A9L._SL1100_.jpg",
        images: [
            "https://m.media-amazon.com/images/I/61U77zE4A9L._SL1100_.jpg",
            "https://www.giftingbonsai.com/cdn/shop/files/Premium-Desktop-Name-Plate-1.jpg"
        ]
    }
];

async function main() {
    try {
        console.log("🚀 Updating product images with high-quality versions...");

        for (const update of updates) {
            const product = await prisma.product.findFirst({
                where: { name: update.name }
            });

            if (product) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: {
                        image: update.image,
                        images: JSON.stringify(update.images)
                    }
                });
                console.log(`✅ Updated: ${update.name}`);
            } else {
                console.log(`❌ Not found: ${update.name}`);
            }
        }

        console.log("\n✨ All images updated successfully!");
    } catch (e: any) {
        console.error("❌ ERROR during update:", e.message);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
