import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import OrderSection from "../components/OrderSection";
import Certification from "../components/Certification";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <OrderSection />
      <Certification />
      <Contact />
      <Footer />
    </div>
  );
}
