import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL as string
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const products = [
    {
        name: "Customised Pen (Engraved)",
        price: 299,
        image: "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.82787-15/550221437_17848655700559127_6436127949424882370_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=MzcyMzUxMzc0OTE3NzQ1NDgzMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=oerEXaQrGwIQ7kNvwED65FU&_nc_oc=AdmlgZMyTkd23EiTo91ivDy4CgR7wsHPFOR_Wl3S1YO_rMJsWCy0KNiN_yTVoX2aotdFzh-fAynTU22MpM5i1fyk&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=hAipcWBZR3iZ253ziQHjgw&_nc_ss=8&oh=00_AfxHfoM9qyyTVgx_zq6o9gsBbjPSV8_ZB1z8tnh3C2U5Rw&oe=69B201AD",
        category: "Stationery",
        images: JSON.stringify([
            "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.82787-15/550221437_17848655700559127_6436127949424882370_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=MzcyMzUxMzc0OTE3NzQ1NDgzMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=oerEXaQrGwIQ7kNvwED65FU&_nc_oc=AdmlgZMyTkd23EiTo91ivDy4CgR7wsHPFOR_Wl3S1YO_rMJsWCy0KNiN_yTVoX2aotdFzh-fAynTU22MpM5i1fyk&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=hAipcWBZR3iZ253ziQHjgw&_nc_ss=8&oh=00_AfxHfoM9qyyTVgx_zq6o9gsBbjPSV8_ZB1z8tnh3C2U5Rw&oe=69B201AD"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 249 },
            { qty: 50, price: 199 }
        ])
    },
    {
        name: "Wooden Mandir / Temple Showpiece",
        price: 499,
        image: "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.71878-15/603653284_4240052022903768_7256398625966640307_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=Mzc5MzU1NTM4ODM2MDY5NTQ3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=cgNsRUP2q0oQ7kNvwH49gsz&_nc_oc=AdmJP5UKAQRdad-OnOkRtJe4aD7_UQSA-YULO0i2KU-BDILJc1ye73G5FWfnERd21v7qqFA7LGENfp8A4-XrZogH&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=hAipcWBZR3iZ253ziQHjgw&_nc_ss=8&oh=00_AfzTKWfaNM700WPBebZt5wq31TxcBwjvFXgzJiySCw9dhA&oe=69B1D4D2",
        category: "Spiritual Decor",
        images: JSON.stringify([
            "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.71878-15/603653284_4240052022903768_7256398625966640307_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=Mzc5MzU1NTM4ODM2MDY5NTQ3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=cgNsRUP2q0oQ7kNvwH49gsz&_nc_oc=AdmJP5UKAQRdad-OnOkRtJe4aD7_UQSA-YULO0i2KU-BDILJc1ye73G5FWfnERd21v7qqFA7LGENfp8A4-XrZogH&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=hAipcWBZR3iZ253ziQHjgw&_nc_ss=8&oh=00_AfzTKWfaNM700WPBebZt5wq31TxcBwjvFXgzJiySCw9dhA&oe=69B1D4D2"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 5, price: 449 },
            { qty: 10, price: 399 }
        ])
    },
    {
        name: "Kids DIY Painting Kit",
        price: 199,
        image: "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.71878-15/621856366_1216741006579820_2624297240890905008_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=MzgxNjk5MTUwNTc5MzUzMDAwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=AxhlMmqQPMcQ7kNvwHMyz9E&_nc_oc=Adnaa34wHdVVu0pz3ZdLdpYIkHF8YtjiCFOkrR7icegL7kw2Io6xD2PV6SlJtLAuSeUYxOlghr5FDXYthOaMjSkq&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=dn8gY2iKmVXC6EEtlwaLhg&_nc_ss=8&oh=00_AfwSRbXo69WvpsoQ8rAUGj_cqzWhTec4AV4Gv1fqwHlpDg&oe=69B1DE34",
        category: "Kids Gift",
        images: JSON.stringify([
            "https://instagram.fbho1-1.fna.fbcdn.net/v/t51.71878-15/621856366_1216741006579820_2624297240890905008_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=101&ig_cache_key=MzgxNjk5MTUwNTc5MzUzMDAwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=AxhlMmqQPMcQ7kNvwHMyz9E&_nc_oc=Adnaa34wHdVVu0pz3ZdLdpYIkHF8YtjiCFOkrR7icegL7kw2Io6xD2PV6SlJtLAuSeUYxOlghr5FDXYthOaMjSkq&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-1.fna&_nc_gid=dn8gY2iKmVXC6EEtlwaLhg&_nc_ss=8&oh=00_AfwSRbXo69WvpsoQ8rAUGj_cqzWhTec4AV4Gv1fqwHlpDg&oe=69B1DE34"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 169 },
            { qty: 50, price: 129 }
        ])
    },
    {
        name: "Customised Name Keychain",
        price: 99,
        image: "https://instagram.fbho1-4.fna.fbcdn.net/v/t51.71878-15/612533757_2899645186890810_1813735801664118683_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzgwNzg0Mjg4NDYwNzExODY2OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=bFArUWEloCQQ7kNvwEHnaZ4&_nc_oc=AdlhHdDbkomSS4tHK6E09o5a-SCcpcvPMTzjTn9tP-K1LNggY1rYqk2DGFUzt-xPG5TJ9x1OUgYFygHbRtGETDSR&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-2.fna&_nc_gid=WLkeXzgTb1w-wevUmQOrDQ&_nc_ss=8&oh=00_AfzhJFrrm4DL9Ucg_1HMUd_LSpR6dSbpRhgK2O906oD6yQ&oe=69B1E5FF",
        category: "Keychain",
        images: JSON.stringify([
            "https://instagram.fbho1-4.fna.fbcdn.net/v/t51.71878-15/612533757_2899645186890810_1813735801664118683_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzgwNzg0Mjg4NDYwNzExODY2OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=bFArUWEloCQQ7kNvwEHnaZ4&_nc_oc=AdlhHdDbkomSS4tHK6E09o5a-SCcpcvPMTzjTn9tP-K1LNggY1rYqk2DGFUzt-xPG5TJ9x1OUgYFygHbRtGETDSR&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-2.fna&_nc_gid=WLkeXzgTb1w-wevUmQOrDQ&_nc_ss=8&oh=00_AfzhJFrrm4DL9Ucg_1HMUd_LSpR6dSbpRhgK2O906oD6yQ&oe=69B1E5FF"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 79 },
            { qty: 50, price: 59 }
        ])
    },
    {
        name: "Customised Photo Keychain",
        price: 249,
        image: "https://instagram.fbho1-3.fna.fbcdn.net/v/t51.71878-15/610933856_1972736939957861_228749367096514451_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=MzgwNzY4MjI1ODQ0MzAyNDQxOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=WpXrhHvoVsYQ7kNvwGa3uyQ&_nc_oc=AdnNsO1K0HUZ9vE8Z7mOLu9hSgM1VW5mITmMrb_RKMnzyMqyx4m2BsyoeYHHy_Wz69EFDIBCXQUIPlX36Q4Goa2R&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-3.fna&_nc_gid=Zr84-ihMnOvJdeBSn7kAoQ&_nc_ss=8&oh=00_AfynELlVYBpRNFQ9TazhWhoQqErfK5j5_i9Ao6LZrPtprw&oe=69B1E9D8",
        category: "Keychain",
        images: JSON.stringify([
            "https://instagram.fbho1-3.fna.fbcdn.net/v/t51.71878-15/610933856_1972736939957861_228749367096514451_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=MzgwNzY4MjI1ODQ0MzAyNDQxOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=WpXrhHvoVsYQ7kNvwGa3uyQ&_nc_oc=AdnNsO1K0HUZ9vE8Z7mOLu9hSgM1VW5mITmMrb_RKMnzyMqyx4m2BsyoeYHHy_Wz69EFDIBCXQUIPlX36Q4Goa2R&_nc_ad=z-m&_nc_cid=2034&_nc_zt=23&_nc_ht=instagram.fbho1-3.fna&_nc_gid=Zr84-ihMnOvJdeBSn7kAoQ&_nc_ss=8&oh=00_AfynELlVYBpRNFQ9TazhWhoQqErfK5j5_i9Ao6LZrPtprw&oe=69B1E9D8"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 10, price: 199 },
            { qty: 25, price: 149 }
        ])
    },
    {
        name: "Wooden Photo Lamp",
        price: 1199,
        image: "https://instagram.fbho1-2.fna.fbcdn.net/v/t51.82787-15/621219705_17864437515559127_7789996165433046975_n.jpg?stp=c0.420.1080.1080a_dst-jpg_e15_s150x150_tt6&_nc_ht=instagram.fbho1-2.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QF_zbG3o6T34NZBzozghwwuI3m3S-fV0eL_XXCdDN3EhqQVZdafdk2FA6rssbRzRCOgPk_tWe0UMDViQ_N77R27&_nc_ohc=O4ZVC5cVSuoQ4kNvwGm3UlK&_nc_gid=xOOww828AiitlD2JBfK5bg&edm=AGW0Xe4BAAAA&ccb=7-5&oh=00_AfwP-9rsSg3RVkwH_jylt6-Fnw7GhodCfOAyJJ6H-Hk9pA&oe=69B20236&_nc_sid=94fea1",
        category: "Home Decor",
        images: JSON.stringify([
            "https://instagram.fbho1-2.fna.fbcdn.net/v/t51.82787-15/621219705_17864437515559127_7789996165433046975_n.jpg?stp=c0.420.1080.1080a_dst-jpg_e15_s150x150_tt6&_nc_ht=instagram.fbho1-2.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QF_zbG3o6T34NZBzozghwwuI3m3S-fV0eL_XXCdDN3EhqQVZdafdk2FA6rssbRzRCOgPk_tWe0UMDViQ_N77R27&_nc_ohc=O4ZVC5cVSuoQ4kNvwGm3UlK&_nc_gid=xOOww828AiitlD2JBfK5bg&edm=AGW0Xe4BAAAA&ccb=7-5&oh=00_AfwP-9rsSg3RVkwH_jylt6-Fnw7GhodCfOAyJJ6H-Hk9pA&oe=69B20236&_nc_sid=94fea1"
        ]),
        bulkPricing: JSON.stringify([
            { qty: 5, price: 999 },
            { qty: 10, price: 899 }
        ])
    }
]

async function main() {
    try {
        console.log("🌱 Updating Art.peak products with REAL Instagram images...\n")

        for (const prodData of products) {
            // Find if exists
            const existing = await prisma.product.findFirst({
                where: { name: prodData.name }
            })

            if (existing) {
                // Update
                const updated = await prisma.product.update({
                    where: { id: existing.id },
                    data: prodData
                })
                console.log(`✅ Updated: ${updated.name}`)
            } else {
                // Create
                const created = await prisma.product.create({ data: prodData })
                console.log(`✅ Created: ${created.name}`)
            }
        }

        console.log(`\n🎉 Successfully processed ${products.length} products!`)
    } catch (e: any) {
        console.error("❌ UPDATE ERROR:", e.message)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
