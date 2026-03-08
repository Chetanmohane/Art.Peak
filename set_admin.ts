import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Seeding Admin user to MongoDB...");
    const email = "Chetanmohane27@gmail.com";
    const password = "Chetan2729";
    const name = "Chetan Mohane";

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "admin",
            name,
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: "admin",
        },
    });

    console.log("✅ Admin user ready:", user.email, "| Role:", user.role);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
