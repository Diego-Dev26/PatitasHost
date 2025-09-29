import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/store";
import client from "@/api";
import Error from "@/components/Error";
import Toggle from "@/components/Toggle";
import Select from "@/components/Select1";
import FilesUpload from "@/components/FilesUpload";
import Icon from "@/components/Icon";

export default function EditarMiMascota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useContext(StoreContext);

  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const imagen_upload = useRef();
  const [mascota, setMascota] = useState({
    nombre: "",
    especie: "",
    raza: "",
    genero: "Macho",
    fecha_nacimiento: "",
    altura: "",
    peso: "",
    descripcion: "",
    alimentacion: "",
    estado_salud: "",
    disponibilidad: true,
    imagen: [],
  });

  // Estado para mensaje de error si la fecha es mayor a hoy
  const [fechaError, setFechaError] = useState("");

  // Fecha de hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (id) {
      store.setLoading(true);
      client
        .post("/mascota/read", { query: { find: { _id: id } } })
        .then((res) => {
          const data = res.data;
          const parsed = { ...mascota };
          for (let key in parsed) {
            parsed[key] = data[key] ?? parsed[key];
          }
          if (parsed.fecha_nacimiento) {
            parsed.fecha_nacimiento = new Date(parsed.fecha_nacimiento)
              .toISOString()
              .slice(0, 10);
          }
          setMascota(parsed);
        })
        .catch(() => setErrors(["Error al cargar los datos"]))
        .finally(() => store.setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = [];
    const campos = [
      "nombre",
      "especie",
      "raza",
      "fecha_nacimiento",
      "altura",
      "peso",
      "descripcion",
      "alimentacion",
    ];
    campos.forEach((campo) => {
      if (!mascota[campo]) err.push(`El campo ${campo} es obligatorio`);
    });
    // Si hay error de fecha futura, también lo añadimos
    if (fechaError) err.push(fechaError);
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
      await client.put(`/mascota/update/${id}`, { mascota });
      store.showSuccess({
        message: "Mascota actualizada correctamente",
        redirect: "/mis-mascotas",
        navigate,
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al guardar";
      setErrors([msg]);
      store.showErrors([msg]);
    } finally {
      store.setLoading(false);
    }
  };

  const handleDelete = async () => {
    store.setLoading(true);
    try {
      await client.delete(`/mascota/delete/${id}`);
      store.showSuccess({
        message: "Mascota eliminada correctamente",
        redirect: "/mis-mascotas",
        navigate,
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al eliminar";
      setErrors([msg]);
      store.showErrors([msg]);
    } finally {
      store.setLoading(false);
      setShowModal(false);
    }
  };

  const validarTexto = (valor) => {
    // Permite solo letras y un único espacio entre palabras
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
    // No permitir iniciar con espacio. Permitir un único espacio entre palabras.
    // Durante el tipeo, se acepta un espacio final para que el usuario pueda seguir escribiendo.
    // Caracteres permitidos: letras (con acentos y ñ), números y ' . , -
    // - Arranca con uno o más caracteres permitidos (sin espacio al inicio).
    // - Puede incluir grupos de: un espacio + uno o más caracteres permitidos.
    // - Opcionalmente, puede terminar en un espacio (para que el usuario siga escribiendo).
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'.,-]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ0-9'.,-]+)* ?$/;
    return regex.test(valor) || valor === "";
  };

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    if (fecha > hoyStr) {
      setFechaError("La fecha no puede ser futura");
    } else {
      setFechaError("");
      setMascota({ ...mascota, fecha_nacimiento: fecha });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Editar Mascota
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
            >
              <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
              Volver
            </button>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="px-6 py-5">
          <Error title="Errores en el formulario" errors={errors} />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["Nombre", "nombre", "text"],
                ["Especie", "especie", "text"],
                ["Raza", "raza", "text"],
                ["Fecha de nacimiento", "fecha_nacimiento", "date"],
                ["Altura (cm)", "altura", "number"],
                ["Peso (kg)", "peso", "number"],
                ["Estado de salud", "estado_salud", "text"],
              ].map(([label, key, type]) => {
                // 1) Campo de fecha
                if (key === "fecha_nacimiento") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={mascota.fecha_nacimiento}
                        onChange={handleFechaChange}
                        max={hoyStr}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {fechaError && (
                        <p className="mt-1 text-xs text-red-500">
                          {fechaError}
                        </p>
                      )}
                    </div>
                  );
                }

                // 2) Campos numéricos (altura, peso) → se aceptan directamente
                if (type === "number") {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={mascota[key]}
                        onChange={(e) => {
                          setMascota({ ...mascota, [key]: e.target.value });
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  );
                }

                // 3) El resto de campos de texto (nombre, especie, raza, estado_salud)
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}{" "}
                      {key !== "estado_salud" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type={type}
                      value={mascota[key]}
                      onChange={(e) => {
                        if (validarTexto(e.target.value)) {
                          setMascota({ ...mascota, [key]: e.target.value });
                        }
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={key !== "estado_salud"}
                    />
                  </div>
                );
              })}
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
              <div className="flex items-center">
                <Toggle
                  label="¿Disponible para adopción?"
                  value={mascota.disponibilidad}
                  setValue={(v) =>
                    setMascota({ ...mascota, disponibilidad: v })
                  }
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
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

            {/* Alimentación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alimentación <span className="text-red-500">*</span>
              </label>
              <textarea
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

            {/* Upload de imágenes */}
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
                Puedes subir hasta 2 imágenes (max. 0.5 MB cada una)
              </p>
            </div>

            {/* Botón para editar historial médico */}
            {id && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/commun-user/historial-form-comun/${id}`)
                  }
                  className="inline-flex items-center text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md mb-4"
                >
                  <Icon name="ClipboardIcon" className="h-5 w-5 mr-2" />
                  Editar Historial Médico
                </button>
              </div>
            )}

            {/* Botón de Eliminar Mascota */}
            {id && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md mb-4"
                >
                  <Icon name="TrashIcon" className="h-5 w-5 mr-2" />
                  Eliminar Mascota
                </button>
              </div>
            )}

            {/* Botón Guardar Cambios */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de confirmación de borrado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ¿Estás seguro de eliminar esta mascota?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción es irreversible y se eliminarán todos los datos
              asociados a la mascota.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
