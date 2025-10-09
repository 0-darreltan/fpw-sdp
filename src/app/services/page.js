import AppNavbar from "../../components/Navbar.jsx";
import Services from "../../components/Services.jsx";
import AppFooter from "../../components/Footer.jsx";

export const metadata = {
  title: "Layanan Kami - Agung Beton Kendari",
  description: "Layanan beton readymix, precast, aspal, dan split berkualitas tinggi di Sulawesi Tenggara",
};

export default function ServicesPage() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <div className="pt-20">
        <Services />
      </div>
      <AppFooter />
    </div>
  );
}