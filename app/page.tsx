import About from "./components/About";
import Contact from "./components/contact/Contacts";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Offers from "./components/Offers";
import Services from "./components/Services";
import Products from "./components/products/Products";

export default function Home() { 
  return (
    <>
      <Navbar />
      <Hero />
      <Offers />
     <Products/>
      <Services />
      <About />
      <Contact />
      <Footer />
      
    </>
  );
}
