import Header from "../components/header/Header";
import Toaster from "../components/Toaster";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <Toaster />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
