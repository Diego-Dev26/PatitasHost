// src/pages/Public/QuienesSomos.jsx
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaLinkedin,
  FaGithub,
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaStar,
  FaBullseye,  // Reemplazo para FaTarget
  FaEye,       // Ya existe en react-icons/fa
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import "./QuienesSomos.css";

// Componente de animación reutilizable
const ScrollAnimation = ({ children, delay = 0, y = 20, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function QuienesSomos() {
  // Variantes para animaciones complejas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="qs-container">
      {/* Hero Section */}
      {/* Hero Section */}
<section className="qs-hero">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="qs-hero-content"
  >
    <motion.h1
      className="qs-title"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      Conectando corazones con patitas
    </motion.h1>
    
    <motion.p
      className="qs-hero-subtitle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      En Patitas, creemos que cada mascota merece un hogar lleno de amor. 
      Desde 2022, hemos ayudado a más de 5,000 animales a encontrar su familia para siempre.
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="qs-hero-cta"
    >
      <motion.button
        href="#adoptarmascotas"
        className="qs-hero-button"
        whileHover={{ 
          y: -3,
          scale: 1.05,
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = '/mascotas'}
      >
        Adopta un compañero
      </motion.button>


      <motion.a
        href="#historia"
        className="qs-hero-link"
        whileHover={{ y: -2 }}
      >
        Conoce nuestra historia →
      </motion.a>
    </motion.div>
  </motion.div>

  <motion.div
    className="qs-hero-image"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <img src="/img/about-hero.jpg" alt="Familia abrazando a su perro adoptado" />
  </motion.div>
</section>

      {/* Navegación rápida */}
      <ScrollAnimation>
        <nav className="qs-quick-nav">
          {['historia', 'mision', 'equipo', 'testimonios', 'contacto'].map((item) => (
            <motion.a
              key={item}
              href={`#${item}`}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </motion.a>
          ))}
        </nav>
      </ScrollAnimation>

      {/* --- Historia --- */}
      <motion.section
        id="historia"
        className="qs-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.h2 className="qs-heading" variants={itemVariants}>
          Nuestra Historia
        </motion.h2>
        
        <motion.div className="qs-timeline" variants={containerVariants}>
          {[
            {
              year: "2022",
              title: "Nacimiento de Patitas",
              description: "Fundada por Alice Pérez y un grupo de amantes de los animales tras adoptar a su primera mascota."
            },
            {
              year: "2023",
              title: "Primer gran hito",
              description: "Superamos las 1,000 adopciones y comenzamos colaboraciones con refugios locales."
            },
            {
              year: "2024",
              title: "Crecimiento exponencial",
              description: "Llegamos a 5,000 adopciones y expandimos nuestro equipo para mejorar el servicio."
            }
          ].map((item, index) => (
            <motion.div 
              key={item.year}
              className="qs-timeline-item"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="qs-timeline-year">{item.year}</div>
              <motion.div 
                className="qs-timeline-content"
                whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* --- Misión y Visión --- */}
      <section id="mision" className="qs-mission-vision">
        <motion.div
          className="qs-mission-card"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <div className="qs-card-header">
            <FaBullseye  className="qs-card-icon" />
            <h2 className="qs-heading">Misión</h2>
          </div>
          <p>
            Facilitar el encuentro entre las personas y las mascotas que necesitan un hogar, 
            promoviendo el bienestar animal, la adopción responsable y el vínculo afectivo duradero.
          </p>
        </motion.div>

        <motion.div
          className="qs-vision-card"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
        >
          <div className="qs-card-header">
            <FaEye className="qs-card-icon" />
            <h2 className="qs-heading">Visión</h2>
          </div>
          <p>
            Ser la plataforma de referencia en adopción y cuidado animal en América Latina, 
            inspirando a miles de personas a formar parte de una comunidad comprometida con 
            la protección y el respeto de todas las especies.
          </p>
        </motion.div>
      </section>

      {/* --- Valores --- */}
      <section className="qs-section">
        <ScrollAnimation y={0}>
          <h2 className="qs-heading">Nuestros Valores</h2>
        </ScrollAnimation>
        
        <motion.div 
          className="qs-values-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {[
            {
              icon: FaHeart,
              title: "Empatía",
              description: "Sentimos el mundo desde el punto de vista de cada mascota."
            },
            {
              icon: FaShieldAlt,
              title: "Transparencia",
              description: "Información clara en cada paso del proceso."
            },
            {
              icon: FaUsers,
              title: "Colaboración",
              description: "Trabajamos unidos con refugios y voluntarios."
            },
            {
              icon: FaStar,
              title: "Excelencia",
              description: "Nos esforzamos por ofrecer la mejor experiencia."
            }
          ].map((value, index) => {
            const IconComponent = value.icon;
            return (
              <motion.div 
                key={value.title}
                className="qs-value-card"
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}
              >
                <motion.div 
                  className="qs-value-icon"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <IconComponent />
                </motion.div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
      {/* --- CTA --- */}
      <motion.section 
        className="qs-cta"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="qs-cta-content"
          whileInView={{ 
            scale: [0.98, 1.01, 1],
            opacity: [0, 1]
          }}
          transition={{ duration: 0.8 }}
        >
          <h2>¿Listo para cambiar una vida?</h2>
          <p>Descubre cómo puedes ayudar ya sea adoptando, siendo hogar temporal o donando.</p>
          <div className="qs-cta-buttons">
            <motion.button 
            className="qs-cta-button qs-cta-primary"
            whileHover={{ 
              y: -3,
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/mascotas'}
          >
            Ver mascotas
          </motion.button>
            <motion.button 
              className="qs-cta-button qs-cta-secondary"
              whileHover={{ 
                y: -3,
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Ser voluntario
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      
    </div>
  );
}