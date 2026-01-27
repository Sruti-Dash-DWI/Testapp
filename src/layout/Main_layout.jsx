import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../pages/Footer.jsx";

const Main_layout = ({ children }) => {
  return (
    <>
      <Navbar></Navbar>
      <main>{children}</main>
      {/* <Footer></Footer> */}
    </>
  );
};

export default Main_layout;
