import AppNavbar from "../../components/Navbar.jsx";
import OrderSection from "../../components/OrderSection.jsx";
import AppFooter from "../../components/Footer.jsx";

export const metadata = {
  title: "Pemesanan - Agung Beton Kendari",
  description: "Pesan layanan beton readymix, precast, aspal, dan split untuk proyek Anda",
};

export default function OrderPage() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <div className="pt-20">
        <OrderSection />
      </div>
      <AppFooter />
    </div>
  );
}