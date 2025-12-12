import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import FrontendLayoutPage from "./pages/FrontEnd/FrontendLayoutPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CustomerDashboard from "./pages/FrontEnd/CustomerDashboard";
import ProjectManagerDashboard from "./pages/FrontEnd/ProjectManagerDashboard";
import AdminDashboard from "./pages/BackEnd/AdminDashboard";
import CheckoutPage from "./pages/FrontEnd/CheckoutPage";
import UpdateProduct from "./components/admin/add_update_produk/UpdateProduct";
import CreatedProduct from "./components/admin/add_update_produk/CreatedProduct";
import CreatedUser from "./components/admin/add_update_user/CreatedUser";
import UpdateUser from "./components/admin/add_update_user/UpdateUser";
import Sertificat from "./components/Sertificat";
import AboutUs from "./components/AboutUs";
import FrontEndHomepage from "./components/FrontEndHomepage";
import Homepage from "./components/Homepage";
import ShopCatalog from "./components/Catalog/ShopCatalog";
import DetailCatalog from "./components/Catalog/DetailCatalog";
import PurchaseHistory from "./components/orders/PurchaseHistory";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route element={<FrontEndHomepage />}>
        <Route index element={<Homepage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="certification" element={<Sertificat />} />
        <Route path="catalog" element={<ShopCatalog />} />
        <Route path="catalog/:id" element={<DetailCatalog />} />
      </Route>

      {/* Auth Routes tanpa Layout */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<FrontendLayoutPage />}>
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="purchase-history" element={<PurchaseHistory />} />
        <Route path="projectmanager" element={<ProjectManagerDashboard />} />
      </Route>

      <Route path="admin" element={<AdminDashboard />}>
        <Route path="products/create" element={<CreatedProduct />} />
        <Route path="products/edit/:id" element={<UpdateProduct />} />
        <Route path="users/create" element={<CreatedUser />} />
        <Route path="users/edit/:id" element={<UpdateUser />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
