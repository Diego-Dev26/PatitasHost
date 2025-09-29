//initJSesterilizacion
import Toggle from "@/components/Toggle";
//endJSesterilizacion
//initJSid_mascota
import Autocomplete from "@/components/Autocomplete";
//endJSid_mascota
import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "@/components/Error";
import { StoreContext } from "@/context/store";
import "./Historial_form.css";
import client from "@/api";

export default function Historial_form() {
  //essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [errors, set_errors] = useState([]);
  //fields
  const [historial, set_historial] = useState({
    //initJSid_mascota
    id_mascota: "",
    //endJSid_mascota
    //initJSesterilizacion
    esterilizacion: false,
    //endJSesterilizacion
    //initJSvacunas
    vacunas: "",
    //endJSvacunas
    //initJSdescripcion
    descripcion: "",
    //endJSdescripcion
    //fieldsModel
  });

  //extraStates

  //initJSid_mascota
  const [mascota_list, set_mascota_list] = useState([]);
  //endJSid_mascota

  //foreigns

  async function getForeigns() {
    store.setLoading(true);
    Promise.all([
      //initJSid_mascota
      client
        .post("/mascota/list")
        .then((r) => set_mascota_list(r?.data?.list || [])),
      //endJSid_mascota

      //callForeigns
    ]).finally(() => {
      store.setLoading(false);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    var errors = [];
    //initJSid_mascota
    if (!historial?.id_mascota) errors.push("El campo Mascota es obligatorio");
    //endJSid_mascota
    //initJSesterilizacion
    if (!historial?.esterilizacion)
      errors.push("El campo Esterilizacion es obligatorio");
    //endJSesterilizacion

    //validaciones
    if (errors.length == 0) {
      store.setLoading(true);

      //beforeSend
      if (id) {
        client
          .put(`/historial/update/${id}`, { historial })
          .then((r) => {
            store.showSuccess({
              message: "Historial Actualizado",
              redirect: "/dashboard/historial/list",
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
          .post(`/historial/create`, { historial })
          .then((r) => {
            store.showSuccess({
              message: "Historial Creado",
              redirect: "/dashboard/historial/list",
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
      set_errors([errors[0]]);
      store.showErrors([errors]);
    }
  }

  //extraEffect

  useEffect(() => {
    getForeigns();
    if (id) {
      store.setLoading(true);
      client
        .post("/historial/read", {
          query: {
            find: { _id: id },
          },
        })
        .then((r) => {
          const fetchedData = r?.data || {};
          const update = Object.keys(historial).reduce((acc, key) => {
            acc[key] =
              fetchedData.hasOwnProperty(key) && fetchedData[key] !== null
                ? fetchedData[key]
                : historial[key];
            return acc;
          }, {});

          //convertRead
          set_historial(update);
        })
        .finally(() => store.setLoading(false));
    }
  }, [id]);

  return (
    <>
      <div className="px-2 py-1 sm:py-2 xl:py-4">
        <div className="bg-gray-50 px-1  py-0.5 sm:py-0.5 2xl:py-1  sm:flex flex flex-wrap-reverse sm:items-center w-full">
          <div className="sm:flex-auto">
            <h1 className="ttext-balance 2xl:text-xl sm:text-lg text-sm  mt-2 sm:mt-0 font-semibold text-gray-900 uppercase">
              {id ? "EDITAR Historial" : "REGISTRAR Historial"}
            </h1>
          </div>
          <div className="ml-8 sm:ml-0 flex-none">
            <Link
              to="../historial/list"
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm bg-transparent 2xl:px-6 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Icon
                name="ArrowLeftCircleIcon"
                className="2xl:h-6 2xl:w-6 sm:mr-4 mr-1 sm:h-5 sm:w-5 h-4 w-4"
              />
              Atras
            </Link>
          </div>
        </div>
        <div className="sm:mt-3 2xl:mt-4 mt-1 bg-gray-50 rounded-lg border border-gray-200">
          <Error title="Error en el Formulario" errors={errors} />
          <form
            onSubmit={handleSubmit}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="px-4 py-4">
              <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 2xl:gap-4 sm:gap-2 gap-1">
                {/* initJSXid_mascota */}

                <div className="col-span-1">
                  <Autocomplete
                    label="Seleccionar Mascota"
                    options={mascota_list}
                    fields={["nombre"]}
                    value={historial?.id_mascota}
                    setValue={(e) =>
                      set_historial({ ...historial, id_mascota: e })
                    }
                  />
                </div>

                {/* endJSXid_mascota */}
                {/* initJSXesterilizacion */}

                <div className="col-span-1">
                  <Toggle
                    label="Esterilizacion"
                    value={historial?.esterilizacion}
                    setValue={(e) =>
                      set_historial({ ...historial, esterilizacion: e })
                    }
                  />
                </div>

                {/* endJSXesterilizacion */}
                {/* initJSXvacunas */}

                <div className="">
                  <label
                    htmlFor="vacunas"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Vacunas
                  </label>
                  <textarea
                    name="vacunas"
                    value={historial?.vacunas}
                    onChange={(e) =>
                      set_historial({ ...historial, vacunas: e.target.value })
                    }
                    rows="3"
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md "
                  />
                </div>

                {/* endJSXvacunas */}
                {/* initJSXdescripcion */}

                <div className="">
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Descripcion
                  </label>
                  <textarea
                    name="descripcion"
                    value={historial?.descripcion}
                    onChange={(e) =>
                      set_historial({
                        ...historial,
                        descripcion: e.target.value,
                      })
                    }
                    rows="3"
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md "
                  />
                </div>

                {/* endJSXdescripcion */}
                {/* inputFields */}
              </div>
            </div>
            <div className="p-2">
              <div className="flex justify-end">
                <Link
                  to="../user/list"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
