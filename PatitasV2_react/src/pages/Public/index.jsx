// src/pages/Public/index.jsx
import React from "react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import CardSection from "./components/CardSection";

export default function Public() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CardSection />
    </>
  );
}
