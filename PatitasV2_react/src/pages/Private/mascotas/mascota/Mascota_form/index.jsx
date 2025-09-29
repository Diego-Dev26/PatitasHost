//initJSdisponibilidad
import Toggle from "@/components/Toggle";
//endJSdisponibilidad
//initJSimagen
import FilesUpload from "@/components/FilesUpload";
//endJSimagen
//initJSimagen
import { useRef } from "react";
//endJSimagen
//initJSgenero
import Select from "@/components/Select1";
//endJSgenero
import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "@/components/Error";
import { StoreContext } from "@/context/store";
import "./Mascota_form.css";
import client from "@/api";

export default function Mascota_form() {
  // essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [errors, set_errors] = useState([]);

  // calcular fecha de hoy en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().slice(0, 10);

  // fields
  const [mascota, set_mascota] = useState({
    // initJSnombre
    nombre: "",
    // endJSnombre
    // initJSespecie
    especie: "",
    // endJSespecie
    // initJSraza
    raza: "",
    // endJSraza
    // initJSgenero
    genero: "Macho",
    // endJSgenero
    // initJSfecha_nacimiento (por defecto hoy)
    fecha_nacimiento: hoyStr,
    // endJSfecha_nacimiento
    // initJSaltura
    altura: "",
    // endJSaltura
    // initJSpeso
    peso: "",
    // endJSpeso
    // initJSdescripcion
    descripcion: "",
    // endJSdescripcion
    // initJSalimentacion
    alimentacion: "",
    // endJSalimentacion
    // initJSestado_salud
    estado_salud: "",
    // endJSestado_salud
    // initJSdisponibilidad (por defecto true)
    disponibilidad: true,
    // endJSdisponibilidad
    // initJSimagen
    imagen: [],
    // endJSimagen
    // fieldsModel
  });

  // initJSimagen
  const imagen_upload = useRef();
  // endJSimagen

  // extraStates
  const [fechaError, setFechaError] = useState("");

  // foreigns
  async function getForeigns() {
    store.setLoading(true);
    Promise.all([
      // callForeigns
    ]).finally(() => {
      store.setLoading(false);
    });
  }

  // Manejador para la fecha: no permite > hoyStr
  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    if (fecha > hoyStr) {
      // Si es futura, no actualizar estado y mostrar error
      setFechaError("La Fecha de Nacimiento no puede ser futura");
    } else {
      // Si es válida (≤ hoy), actualizamos y limpiamos error
      setFechaError("");
      set_mascota({ ...mascota, fecha_nacimiento: fecha });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = [];

    // initJSnombre
    if (!mascota?.nombre) errs.push("El campo Nombre es obligatorio");
    // endJSnombre
    // initJSespecie
    if (!mascota?.especie) errs.push("El campo Especie es obligatorio");
    // endJSespecie
    // initJSraza
    if (!mascota?.raza) errs.push("El campo Raza es obligatorio");
    // endJSraza
    // initJSfecha_nacimiento
    if (!mascota?.fecha_nacimiento)
      errs.push("El campo Fecha Nacimiento es obligatorio");
    // endJSfecha_nacimiento
    // validación adicional por si acaso llegase fecha > hoyStr
    if (mascota.fecha_nacimiento > hoyStr)
      errs.push("La Fecha de Nacimiento no puede ser futura");
    // initJSaltura
    if (!mascota?.altura) errs.push("El campo Altura (cm) es obligatorio");
    // endJSaltura
    // initJSpeso
    if (!mascota?.peso) errs.push("El campo Peso (kg) es obligatorio");
    // endJSpeso
    // initJSdescripcion
    if (!mascota?.descripcion)
      errs.push("El campo Descripción es obligatorio");
    // endJSdescripcion
    // initJSalimentacion
    if (!mascota?.alimentacion)
      errs.push("El campo Alimentación es obligatorio");
    // endJSalimentacion

    if (errs.length === 0) {
      store.setLoading(true);

      // initJSimagen
      mascota.imagen = [
        ...mascota.imagen,
        ...(await imagen_upload.current.uploadFilesComponent()),
      ];
      // endJSimagen

      // beforeSend
      if (id) {
        client
          .put(`/mascota/update/${id}`, { mascota })
          .then(() => {
            store.showSuccess({
              message: "Mascota Actualizada",
              redirect: "/dashboard/mascota/list",
              navigate,
            });
          })
          .catch((e) => {
            const errorMessage =
              e?.response?.data?.message || "Error al Actualizar Registro";
            set_errors([errorMessage]);
            store.showErrors([errorMessage]);
          })
          .finally(() => store.setLoading(false));
      } else {
        client
          .post(`/mascota/create`, { mascota })
          .then(() => {
            store.showSuccess({
              message: "Mascota Creada",
              redirect: "/dashboard/mascota/list",
              navigate,
            });
          })
          .catch((e) => {
            const errorMessage =
              e?.response?.data?.message || "Error al Crear Registro";
            set_errors([errorMessage]);
            store.showErrors([errorMessage]);
          })
          .finally(() => store.setLoading(false));
      }
    } else {
      set_errors([errs[0]]);
      store.showErrors(errs);
    }
  }

  // extraEffect
  useEffect(() => {
    getForeigns();
    if (id) {
      store.setLoading(true);
      client
        .post("/mascota/read", {
          query: {
            find: { _id: id },
          },
        })
        .then((r) => {
          const fetchedData = r?.data || {};
          const update = Object.keys(mascota).reduce((acc, key) => {
            acc[key] =
              fetchedData.hasOwnProperty(key) && fetchedData[key] !== null
                ? fetchedData[key]
                : mascota[key];
            return acc;
          }, {});

          // initJSfecha_nacimiento
          if (update?.fecha_nacimiento) {
            const fechaIso = new Date(update.fecha_nacimiento)
              .toISOString()
              .slice(0, 10);
            // Si el servidor envía mañana o futuro, forzamos a hoyStr
            if (fechaIso > hoyStr) {
              update.fecha_nacimiento = hoyStr;
            } else {
              update.fecha_nacimiento = fechaIso;
            }
          }
          // endJSfecha_nacimiento

          // convertRead
          set_mascota(update);
        })
        .finally(() => store.setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // validación para campos que solo admiten letras, acentos y un espacio simple
  const handleLetterKeyDown = (e) => {
    const key = e.key;
    // permitir teclas de control (Backspace, flechas, etc.)
    if (key.length > 1) return;
    // permitir solo letras (incluye acentos y ñ) y espacio
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]$/.test(key)) {
      e.preventDefault();
      return;
    }
    // si es espacio, impedir al inicio o tras otro espacio
    if (key === " ") {
      const { value, selectionStart } = e.target;
      if (selectionStart === 0 || value[selectionStart - 1] === " ") {
        e.preventDefault();
      }
    }
  };

  // prohíbe pegar texto que contenga números, caracteres no alfabéticos o dobles espacios
  const handleLetterPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (
      !/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(paste) ||
      paste.startsWith(" ") ||
      /\s{2,}/.test(paste)
    ) {
      e.preventDefault();
    }
  };

  // validación para “Descripción” y “Alimentación”:
  // • permite letras (con acentos), números y estos caracteres: ' . , - ;
  // • no permite iniciar con espacio;
  // • solo permite un espacio simple entre grupos de caracteres.
  const handleDescKeyDown = (e) => {
    const key = e.key;
    // permitir teclas de control (Backspace, flechas, etc.)
    if (key.length > 1) return;
    // permitir letras, números y estos caracteres especiales: ' . , - ;
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9'\.,;\- ]$/.test(key)) {
      e.preventDefault();
      return;
    }
    // si es espacio, impedir al inicio o tras otro espacio
    if (key === " ") {
      const { value, selectionStart } = e.target;
      if (selectionStart === 0 || value[selectionStart - 1] === " ") {
        e.preventDefault();
      }
    }
  };

  // al pegar en descripción/alimentación, bloquear si:
  // • comienza con espacio;
  // • contiene dobles espacios;
  // • contiene caracteres fuera de letras, números o ' . , - ;
  const handleDescPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (
      paste.startsWith(" ") ||
      /\s{2,}/.test(paste) ||
      !/^[A-Za-zÀ-ÖØ-öø-ÿ0-9'\.,;\- ]+$/.test(paste)
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                {id ? "Editar Mascota" : "Registrar Nueva Mascota"}
              </h1>
              <Link
                to="../mascota/list"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon name="ArrowLeftCircleIcon" className="mr-2 h-5 w-5" />
                Volver
              </Link>
            </div>
          </div>

          <Error title="Error en el Formulario" errors={errors} />

          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <div className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Campo Nombre */}
                <div className="col-span-1">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={mascota?.nombre}
                    onChange={(e) =>
                      set_mascota({ ...mascota, nombre: e.target.value })
                    }
                    onKeyDown={handleLetterKeyDown}
                    onPaste={handleLetterPaste}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Especie */}
                <div className="col-span-1">
                  <label
                    htmlFor="especie"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Especie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="especie"
                    value={mascota?.especie}
                    onChange={(e) =>
                      set_mascota({ ...mascota, especie: e.target.value })
                    }
                    onKeyDown={handleLetterKeyDown}
                    onPaste={handleLetterPaste}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Raza */}
                <div className="col-span-1">
                  <label
                    htmlFor="raza"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Raza <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="raza"
                    value={mascota?.raza}
                    onChange={(e) =>
                      set_mascota({ ...mascota, raza: e.target.value })
                    }
                    onKeyDown={handleLetterKeyDown}
                    onPaste={handleLetterPaste}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Género */}
                <div className="col-span-1">
                  <Select
                    label="Género"
                    options={["Macho", "Hembra"]}
                    value={mascota?.genero}
                    setValue={(e) => set_mascota({ ...mascota, genero: e })}
                  />
                </div>

                {/* Campo Fecha Nacimiento */}
                <div className="col-span-1">
                  <label
                    htmlFor="fecha_nacimiento"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fecha Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={mascota?.fecha_nacimiento}
                    onChange={handleFechaChange}
                    max={hoyStr}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                  {fechaError && (
                    <p className="mt-1 text-xs text-red-500">{fechaError}</p>
                  )}
                </div>

                {/* Campo Altura */}
                <div className="col-span-1">
                  <label
                    htmlFor="altura"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Altura (cm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="altura"
                    value={mascota?.altura}
                    onChange={(e) =>
                      set_mascota({ ...mascota, altura: e.target.value })
                    }
                    required
                    step="0.01"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Peso */}
                <div className="col-span-1">
                  <label
                    htmlFor="peso"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Peso (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="peso"
                    value={mascota?.peso}
                    onChange={(e) =>
                      set_mascota({ ...mascota, peso: e.target.value })
                    }
                    required
                    step="0.01"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Estado de Salud */}
                <div className="col-span-1">
                  <label
                    htmlFor="estado_salud"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Estado de Salud
                  </label>
                  <input
                    type="text"
                    name="estado_salud"
                    value={mascota?.estado_salud}
                    onChange={(e) =>
                      set_mascota({
                        ...mascota,
                        estado_salud: e.target.value,
                      })
                    }
                    onKeyDown={handleLetterKeyDown}
                    onPaste={handleLetterPaste}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Disponibilidad */}
                <div className="col-span-1 flex items-center">
                  <Toggle
                    label="Disponible para adopción"
                    value={mascota?.disponibilidad}
                    setValue={(e) =>
                      set_mascota({ ...mascota, disponibilidad: e })
                    }
                  />
                </div>

                {/* Campo Descripción */}
                <div className="col-span-full">
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descripcion"
                    value={mascota?.descripcion}
                    onChange={(e) =>
                      set_mascota({
                        ...mascota,
                        descripcion: e.target.value,
                      })
                    }
                    onKeyDown={handleDescKeyDown}
                    onPaste={handleDescPaste}
                    required
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Alimentación */}
                <div className="col-span-full">
                  <label
                    htmlFor="alimentacion"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Alimentación <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alimentacion"
                    value={mascota?.alimentacion}
                    onChange={(e) =>
                      set_mascota({
                        ...mascota,
                        alimentacion: e.target.value,
                      })
                    }
                    onKeyDown={handleDescKeyDown}
                    onPaste={handleDescPaste}
                    required
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                  />
                </div>

                {/* Campo Imagen */}
                <div className="col-span-full">
                  <FilesUpload
                    label="Imágenes de la mascota"
                    name="imagen"
                    files={mascota?.imagen}
                    setFiles={(e) =>
                      set_mascota({ ...mascota, imagen: e })
                    }
                    ref={imagen_upload}
                    accept="image/*"
                    maxFiles={2}
                    maxSize={5}
                    maxSizeImage={0.5}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Sube hasta 2 imágenes (máx. 0.5MB cada una)
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                type="button"
                onClick={() => navigate("../mascota/list")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {id ? "Actualizar Mascota" : "Registrar Mascota"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
