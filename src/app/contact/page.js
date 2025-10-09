import AppNavbar from "../../components/Navbar.jsx";
import Contact from "../../components/Contact.jsx";
import AppFooter from "../../components/Footer.jsx";

export const metadata = {
  title: "Hubungi Kami - Agung Beton Kendari",
  description: "Hubungi PT. Agung Bumi Karsa untuk konsultasi dan informasi layanan konstruksi",
};

export default function ContactPage() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <div className="pt-20">
        <Contact />
      </div>
      <AppFooter />
    </div>
  );
}