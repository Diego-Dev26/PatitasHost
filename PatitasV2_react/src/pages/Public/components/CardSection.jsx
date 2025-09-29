import React from "react";

const cards = [
  {
    title: "Mascotas en Adopción",
    desc: "Explora las mascotas que buscan un hogar.",
    button: "Ver Mascotas",
    img: "https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg",
    
  },
  {
    title: "Agenda una Cita",
    desc: "Programa una visita para conocer a tu futura mascota.",
    button: "Agendar Cita",
    img: "https://images.pexels.com/photos/6235135/pexels-photo-6235135.jpeg",
  },
  {
    title: "Haz una Donación",
    desc: "Ayuda a los refugios con alimentos, medicinas o apoyo monetario.",
    button: "Donar Ahora",
    img: "https://images.pexels.com/photos/7310272/pexels-photo-7310272.jpeg",
  },
  {
    title: "Historias de Éxito",
    desc: "Conoce las historias de mascotas que encontraron un hogar lleno de amor.",
    button: "Ver Historias",
    img: "https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg",
  },
];

function CardSection() {
  return (
    <div className="w-full px-4 py-10" style={{ backgroundColor: "#F8F4E9" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center max-w-6xl mx-auto">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[25px] shadow-lg w-full max-w-sm overflow-hidden"
          >
            <img
              src={card.img}
              alt={card.title}
              className="h-48 w-full object-cover rounded-t-[25px]"
            />
            <div className="p-6 text-center">
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{card.desc}</p>
              <button className="mt-4 px-5 py-2 text-sm font-semibold bg-[#5D8A66] text-white rounded-full hover:bg-green-700 transition">
                {card.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardSection;
