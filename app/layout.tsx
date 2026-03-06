
import Navbar from "./components/Navbar";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthContext from "./context/AuthContext";

export const metadata = { 
  title: "Art.Peak - Precision Engraving",
  description: "Premium Laser Engraving Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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


