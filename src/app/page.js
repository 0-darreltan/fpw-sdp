import AppNavbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import OrderSection from "../components/OrderSection.jsx";
import Certification from "../components/Certification.jsx";
import Contact from "../components/Contact.jsx";
import AppFooter from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <Hero />
      <About />
      <Services />
      <OrderSection />
      <Certification />
      <Contact />
      <AppFooter />
    </div>
  );
}
