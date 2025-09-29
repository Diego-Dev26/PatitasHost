import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "@/context/store";
import "./Denuncia_delete.css";
import client from "@/api";

export default function Denuncia_delete() {
  //essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [denuncia, set_denuncia] = useState({});
  const populate = [
    //initJSid_usuario
    "id_usuario",
    //endJSid_usuario
    //foreigns
    "last_user",
  ];

  function deleteDenuncia() {
    store.setLoading(true);
    client
      .delete(`/denuncia/delete/${id}`)
      .then((r) => {
        store.showSuccess({
          message: "Registro Eliminado",
          redirect: "/dashboard/denuncia/list",
          navigate,
        });
      })
      .catch((e) => {
        store.showErrors(["Error al Eliminar el Registro"]);
      })
      .finally(() => store.setLoading(false));
  }

  useEffect(() => {
    store.setLoading(true);
    if (id) {
      store.setLoading(true);
      client
        .post("/denuncia/read", {
          query: {
            find: { _id: id },
            populate,
          },
        })
        .then((r) => {
          set_denuncia(r?.data);
        })
        .finally(() => store.setLoading(false));
    }
  }, []);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 uppercase">
              ELIMINAR Denuncia
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="../denuncia/list"
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
            >
              <Icon name="ArrowLeftCircleIcon" className="h-6 w-6" />
              Atras
            </Link>
          </div>
        </div>
        <div className="sm:mt-3 2xl:mt-4 mt-1  px-4 py-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-lg mt-2 max-w-xl text-2xl text-gray-500">
            <p>¿Está seguro de eliminar el registro?</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={deleteDenuncia}
              className="text-lg inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
            >
              Eliminar Denuncia
            </button>
          </div>

          <dl className=" grid 2xl:grid-cols-5 sm:grid-cols-4 grid-cols-1 2xl:gap-4 sm:gap-2 gap-1">
            {/* initJSXid_usuario */}

            <div className=" ">
              <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Usuario
              </dt>
              <dd className="block font-medium text-black 2xl:text-sm text-xs">
                {denuncia?.id_usuario
                  ? `${denuncia.id_usuario.nombres} ${
                      denuncia.id_usuario.primerApellido || ""
                    }`
                  : "No disponible"}
              </dd>
            </div>

            {/* endJSXid_usuario */}
            {/* initJSXtipo_denuncia */}

            <div className="">
              <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Tipo de Denuncia
              </dt>
              <dd className="block font-medium text-black 2xl:text-sm text-xs">
                {denuncia?.tipo_denuncia}
              </dd>
            </div>

            {/* endJSXtipo_denuncia */}
            {/* initJSXdescripcion */}

            <div className="">
              <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Descripcion
              </dt>
              <dd
                className="block font-medium text-black 2xl:text-sm text-xs"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {denuncia?.descripcion}
              </dd>
            </div>

            {/* endJSXdescripcion */}
            {/* initJSXestado */}

            <div className="">
              <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Estado
              </dt>
              <dd className="block font-medium text-black 2xl:text-sm text-xs">
                {denuncia?.estado}
              </dd>
            </div>

            {/* endJSXestado */}
            {/* fieldsDetail */}
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Último Editor
              </dt>
              <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                {denuncia?.last_user?.name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Creado en
              </dt>
              <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                {new Date(denuncia?.createdAt).toLocaleString("es-ES")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Actualizado en
              </dt>
              <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                {new Date(denuncia?.updatedAt).toLocaleString("es-ES")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
