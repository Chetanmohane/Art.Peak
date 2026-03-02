
import Navbar from "./components/Navbar";
import "./globals.css";



export const metadata = { 
  title: "LaserCraft - Precision Engraving",
  description: "Premium Laser Engraving Services",
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Navbar />
        {children}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}

//Pymenth Method 


