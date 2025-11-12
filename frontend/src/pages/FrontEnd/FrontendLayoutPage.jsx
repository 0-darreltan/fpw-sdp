import { Outlet } from "react-router";
import Header from "../../components/layout/Header";

const FrontendLayoutPage = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default FrontendLayoutPage;
