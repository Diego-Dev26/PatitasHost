import { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { StoreContext } from "@/context/store";
import client from "@/api";
import Error from "@/components/Error";
import FilesUpload from "@/components/FilesUpload";
import Select from "@/components/Select1";
import Toggle from "@/components/Toggle";
import Icon from "@/components/Icon";

export default function MascotaFormComun() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [errors, setErrors] = useState([]);
  const [showHistorialBtn, setShowHistorialBtn] = useState(false);

  const [mascota, setMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    genero: "Macho",
    fecha_nacimiento: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0],
    altura: "",
    peso: "",
    descripcion: "",
    alimentacion: "",
    estado_salud: "",
    disponibilidad: true,
    imagen: [],
  });

  const imagen_upload = useRef();
  const [idMascotaCreada, setIdMascotaCreada] = useState(null);

  useEffect(() => {
    if (id) {
      store.setLoading(true);
      client
        .post("/mascota/read", {
          query: { find: { _id: id } },
        })
        .then((r) => {
          const data = r?.data || {};
          const update = Object.keys(mascota).reduce((acc, key) => {
            acc[key] = data[key] ?? mascota[key];
            return acc;
          }, {});

          if (update?.fecha_nacimiento)
            update.fecha_nacimiento = new Date(update.fecha_nacimiento)
              .toISOString()
              .slice(0, 10);

          setMascota(update);
        })
        .finally(() => store.setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = [];
    [
      "nombre",
      "especie",
      "raza",
      "fecha_nacimiento",
      "altura",
      "peso",
      "descripcion",
      "alimentacion",
    ].forEach((field) => {
      if (!mascota[field]) err.push(`El campo ${field} es obligatorio`);
    });

    if (err.length > 0) {
      setErrors(err);
      store.showErrors(err);
      return;
    }

    store.setLoading(true);
    try {
      mascota.imagen = [
        ...mascota.imagen,
        ...(await imagen_upload.current.uploadFilesComponent()),
      ];

      const request = id
        ? client.put(`/mascota/update/${id}`, { mascota })
        : client.post("/mascota/create", { mascota });

      const response = await request;

      if (!id && response?.data?._id) {
        setShowHistorialBtn(true);
        setIdMascotaCreada(response.data._id);
        store.showSuccess({
          message: "Mascota registrada correctamente",
        });
      } else {
        store.showSuccess({
          message: "Mascota actualizada",
          redirect: "/mis-mascotas",
          navigate,
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al guardar";
      setErrors([msg]);
      store.showErrors([msg]);
    } finally {
      store.setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm("¿Estás seguro de eliminar esta mascota?");
    if (!confirm) return;

    try {
      await client.delete(`/mascota/delete/${id}`);
      store.showSuccess({
        message: "Mascota eliminada",
        redirect: "/mis-mascotas",
        navigate,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al eliminar";
      setErrors([msg]);
      store.showErrors([msg]);
    }
  };
  const validarTexto = (valor) => {
    // Permite letras y un solo espacio entre palabras
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ]+ ?)*$/;
    return regex.test(valor) || valor === "";
  };

  const validarTextog = (valor) => {
    // Letras (con acentos y ñ) y caracteres especiales permitidos: ' . , -
    // Un solo espacio opcional entre palabras
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ'.,-]+ ?)*$/;
    return regex.test(valor) || valor === "";
  };
  const validarTextoDes = (valor) => {
    // Permite letras (con acentos y ñ), números, caracteres especiales ' . , -
    // Solo un espacio simple entre caracteres, no dobles espacios
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúÑñ0-9'.,-\s]*[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'.,-]\s?)*$/;
    // Explicación: grupo que puede tener letras, números, especiales y un espacio opcional
    // Siempre que no haya dobles espacios ni termine con espacio
    return regex.test(valor) && !/\s{2,}/.test(valor) || valor === "";
  };

  const [fechaError, setFechaError] = useState("");

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    const hoy = new Date().toISOString().slice(0, 10);

    if (fecha > hoy) {
      setFechaError("La fecha no puede ser futura");
    } else {
      setFechaError("");
      setMascota({ ...mascota, fecha_nacimiento: fecha });
    }
  };





  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {id ? "Editar Mascota" : "Registrar Nueva Mascota"}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
              >
                <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
                Volver
              </button>
              {id && (
                <button
                  onClick={handleDelete}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5">
          <Error title="Errores en el formulario" errors={errors} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Max"
                  value={mascota.nombre}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (validarTexto(valor)) {
                      setMascota({ ...mascota, nombre: valor });
                    }
                  }}

                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Perro"
                  value={mascota.especie}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (validarTexto(valor)) {
                      setMascota({ ...mascota, especie: valor });
                    }
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raza <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Labrador"
                  value={mascota.raza}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (validarTexto(valor)) {
                      setMascota({ ...mascota, raza: valor });
                    }
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género <span className="text-red-500">*</span>
                </label>
                <Select
                  options={["Macho", "Hembra"]}
                  value={mascota.genero}
                  setValue={(v) => setMascota({ ...mascota, genero: v })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={mascota.fecha_nacimiento}
                  max={new Date().toISOString().slice(0, 10)}  // Aquí limitas la fecha máxima a hoy
                  onChange={(e) =>
                    setMascota({ ...mascota, fecha_nacimiento: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Ej: 45.5"
                  value={mascota.altura}
                  onChange={(e) =>
                    setMascota({ ...mascota, altura: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Ej: 12.3"
                  value={mascota.peso}
                  onChange={(e) =>
                    setMascota({ ...mascota, peso: e.target.value })
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de Salud
                </label>
                <input
                  type="text"
                  placeholder="Ej: Saludable, vacunas al día"
                  value={mascota.estado_salud}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (validarTextog(valor)) {
                      setMascota({ ...mascota, estado_salud: valor });
                    }
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <Toggle
                  label="Disponible para adopción"
                  value={mascota.disponibilidad}
                  setValue={(v) =>
                    setMascota({ ...mascota, disponibilidad: v })
                  }
                />
              </div>
            </div>

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe a tu mascota (carácter, comportamiento, etc.)"
                value={mascota.descripcion}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (validarTextoDes(valor)) {
                    setMascota({ ...mascota, descripcion: valor });
                  }
                }}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Feeding Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alimentación <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe la dieta y horarios de alimentación"
                value={mascota.alimentacion}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (validarTextoDes(valor)) {
                    setMascota({ ...mascota, alimentacion: valor });
                  }
                }}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes de la mascota
              </label>
              <FilesUpload
                name="imagen"
                files={mascota.imagen}
                setFiles={(f) => setMascota({ ...mascota, imagen: f })}
                ref={imagen_upload}
                accept="image/*"
                maxFiles={2}
                maxSize={5}
                maxSizeImage={0.5}
              />
              <p className="mt-1 text-xs text-gray-500">
                Puedes subir hasta 2 imágenes (max. 0.5MB cada una)
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
              >
                <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
                Cancelar
              </button>

              <div className="flex space-x-2">
                {showHistorialBtn && idMascotaCreada && (
                  <Link
                    to={`/commun-user/historial-form-comun/${idMascotaCreada}`}
                    className="inline-flex items-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                  >
                    <Icon name="ClipboardIcon" className="h-5 w-5 mr-2" />
                    Agregar Historial Médico
                  </Link>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {id ? "Actualizar Mascota" : "Registrar Mascota"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
