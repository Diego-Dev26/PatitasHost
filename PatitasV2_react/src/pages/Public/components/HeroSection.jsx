import React from "react";

function HeroSection() {
  return (
    <div className="relative">
      <img
        src="https://images.pexels.com/photos/7210701/pexels-photo-7210701.jpeg"
        alt="Hero"
        className="w-full h-[300px] md:h-[450px] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
          Crear Un Hogar
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl mt-1">
          Comienza Contigo
        </h2>
        <p className="mt-2 text-sm md:text-base">
          ¡Tráelos a casa y llevarás amor!
        </p>
      </div>
    </div>
  );
}

export default HeroSection;
