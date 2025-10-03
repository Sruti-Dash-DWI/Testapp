import React from "react";
import Main_layout from "../layout/Main_layout.jsx";
import Landing from "./Landing.jsx";
import AboutUs from "./AboutUs";
import AboutPage from "./AboutPage";
import Services from "./Services.jsx";
import TestimonialSection from "./TestimonialSection.jsx";

const HomePage = () => {
  return (
    <>
      <Main_layout>
        <Landing></Landing>
        <AboutUs></AboutUs>
        <AboutPage></AboutPage>
        <Services></Services>
        <TestimonialSection></TestimonialSection>
      </Main_layout>
    </>
  );
};

export default HomePage;
