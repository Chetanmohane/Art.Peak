
import products from "razorpay/dist/types/products";
import About from "./components/About";
import Contact from "./components/contact/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

import Services from "./components/Services";
import Products from "./components/products/Products";

export default function Home() { 
  return (
    <>
      <Navbar />
      <Hero />
     <Products/>
      <Services />
      <About />
      <Contact />
      <Footer />
      
    </>
  );
}
