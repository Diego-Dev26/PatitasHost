import React from "react";

function AboutSection() {
  return (
    <div
      className="flex justify-center py-10 px-4"
      style={{ backgroundColor: "#F8F4E9" }}
    >
      <div className="bg-white rounded-[25px] p-6 w-full max-w-2xl text-center shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold">Sobre Nosotros</h2>
        <p className="mt-2 text-gray-700 text-sm sm:text-base">
          Somos un puente entre refugios y adoptantes, facilitando adopciones
          responsables.
        </p>
      </div>
    </div>
  );
}

export default AboutSection;
