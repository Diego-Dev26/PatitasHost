// src/pages/Private/denuncias/denuncia/Denuncia_form/index.jsx
import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Error from "@/components/Error";
import { StoreContext } from "@/context/store";
// import "./Denuncia_form.css";
import client from "@/api";

export default function Denuncia() {
  // essentials
  const { id } = useParams(); // id del usuario dueño pasado por la URL
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [errors, set_errors] = useState([]);

  // fields
  const [denuncia, set_denuncia] = useState({
    id_usuario: "", // se rellenará automáticamente
    tipo_denuncia: "Datos Incorrectos",
    descripcion: "",
    estado: "Pendiente",
  });
  const [nombreUsuario, set_nombreUsuario] = useState("");

  // al montar, inyectamos el parámetro `id` en `id_usuario`
  useEffect(() => {
    if (id) {
      set_denuncia((d) => ({ ...d, id_usuario: id }));

      // Opción A: con parámetro en URL
      //client.get(`/user/read/${id}`) // <-- Usa esta si es por params
      // Opción B: con query (comenta la A si usas esta)
      client
        .get(`/user/read/${id}`)

        .then((res) => {
          const usuario = res.data?.user;
          if (usuario) {
            const nombreCompleto = `${usuario.nombres} ${usuario.primerApellido}`;
            set_nombreUsuario(nombreCompleto);
          } else {
            set_nombreUsuario("Usuario no encontrado");
          }
        })
        .catch(() => {
          set_nombreUsuario("Error al obtener el usuario");
        });
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = [];

    if (!denuncia.id_usuario)
      validationErrors.push("El campo Usuario es obligatorio");
    if (!denuncia.tipo_denuncia)
      validationErrors.push("El campo Tipo de Denuncia es obligatorio");

    if (validationErrors.length > 0) {
      set_errors([validationErrors[0]]);
      store.showErrors(validationErrors);
      return;
    }

    store.setLoading(true);
    client
      .post("/denuncia/create", { denuncia })

      .then(() => {
        store.showSuccess({
          message: "Denuncia Creada",
          redirect: "/commun-user",
          navigate,
        });
      })
      .catch((e) => {
        const msg = e?.response?.data?.message || "Error al guardar denuncia";
        set_errors([msg]);
        store.showErrors([msg]);
      })
      .finally(() => store.setLoading(false));
  }

  return (
    <div className="px-2 py-4">
      <div className="bg-gray-50 px-4 py-2 sm:flex sm:items-center w-full mb-4">
        <h1 className="flex-auto text-lg font-semibold text-gray-900 uppercase">
          {id ? "EDITAR Denuncia" : "REGISTRAR Denuncia"}
        </h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
        >
          <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
          Atrás
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Error title="Error en el Formulario" errors={errors} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Usuario denunciado (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Usuario denunciado
            </label>
            <p className="mt-1 text-gray-900">{nombreUsuario}</p>
          </div>

          {/* Tipo de denuncia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Denuncia
            </label>
            <select
              value={denuncia.tipo_denuncia}
              onChange={(e) =>
                set_denuncia({ ...denuncia, tipo_denuncia: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300"
            >
              <option>Datos Incorrectos</option>
              <option>Venta del animal</option>
              <option>Otros</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows="4"
              value={denuncia.descripcion}
              onChange={(e) =>
                set_denuncia({ ...denuncia, descripcion: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-300 focus:border-blue-300"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
