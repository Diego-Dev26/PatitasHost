import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="text-white mt-10" style={{ backgroundColor: "#5D8A66" }}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Contacto */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-sm sm:text-base">Contáctenos</h3>
          <p className="text-sm text-green-200">+591-77905556</p>
          <p className="text-sm text-green-200">+591-76413134</p>
        </div>

        {/* Texto central */}
        <p className="text-sm text-center font-semibold">
          © 2025 The Patitas Company. Todos los derechos reservados.
        </p>

        {/* Redes sociales */}
        <div className="flex space-x-4 text-2xl">
          <FaFacebook className="hover:text-gray-300 cursor-pointer" />
          <FaInstagram className="hover:text-gray-300 cursor-pointer" />
          <FaTiktok className="hover:text-gray-300 cursor-pointer" />
          <FaYoutube className="hover:text-gray-300 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
