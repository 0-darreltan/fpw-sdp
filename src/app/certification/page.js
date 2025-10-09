import AppNavbar from "../../components/Navbar.jsx";
import Certification from "../../components/Certification.jsx";
import AppFooter from "../../components/Footer.jsx";

export const metadata = {
  title: "Sertifikat - Agung Beton Kendari",
  description: "Sertifikat dan kredibilitas PT. Agung Bumi Karsa - ISO 45001:2018 dan akreditasi lainnya",
};

export default function CertificationPage() {
  return (
    <div className="font-sans">
      <AppNavbar />
      <div className="pt-20">
        <Certification />
      </div>
      <AppFooter />
    </div>
  );
}