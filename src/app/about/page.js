import AppNavbar from "../../components/Navbar.jsx";
import About from "../../components/About.jsx";
import AppFooter from "../../components/Footer.jsx";

export const metadata = {
  title: "Tentang Kami - Agung Beton Kendari",
  description: "Tentang PT. Agung Bumi Karsa - Spesialis beton readymix, precast, aspal, dan split di Sulawesi Tenggara",
};

export default function AboutPage() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <div className="pt-20">
        <About />
      </div>
      <AppFooter />
    </div>
  );
}