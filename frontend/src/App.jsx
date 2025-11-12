import Homepage from "./components/Homepage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import ErrorPage from "./components/ErrorPage";
import FrontendLayoutPage from "./pages/FrontEnd/FrontendLayoutPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CustomerDashboard from "./pages/FrontEnd/CustomerDashboard";
import ProjectManagerDashboard from "./pages/FrontEnd/ProjectManagerDashboard";
import AdminDashboard from "./pages/FrontEnd/AdminDashboard";
import CheckoutPage from "./pages/FrontEnd/CheckoutPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      <Route index element={<Homepage />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<FrontendLayoutPage />}>
        <Route path="customer" element={<CustomerDashboard />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="projectmanager" element={<ProjectManagerDashboard />} />
      </Route>
      <Route path="admin" element={<AdminDashboard />} />
    </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
