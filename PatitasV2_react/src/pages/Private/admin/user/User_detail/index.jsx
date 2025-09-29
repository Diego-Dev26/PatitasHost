import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StoreContext } from "@/context/store";
import BadgeBool from "@/components/BadgeBool";
import "./User_detail.css";
import client from "@/api";

export default function User_detail() {
  //essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const [user, set_user] = useState({});
  const populate = ["groups", "permissions", "last_user"];

  useEffect(() => {
    if (id) {
      store.setLoading(true);
      client
        .post("/user/read", {
          query: {
            find: { _id: id },
            populate,
          },
        })
        .then((r) => {
          set_user(r?.data);
        })
        .catch((e) => {
          store.showErrors(["Error en la lectura"]);
        })
        .finally(() => store.setLoading(false));
    }
  }, []);

  return (
    <>
      <div className="px-2 py-1 sm:py-2 xl:py-4">
        <div className="bg-gray-50 px-1  py-0.5 sm:py-0.5 2xl:py-1  sm:flex flex flex-wrap-reverse sm:items-center w-full">
          <div className="sm:flex-auto">
            <h1 className="ttext-balance 2xl:text-xl sm:text-lg text-sm  mt-2 sm:mt-0 font-semibold text-gray-900 uppercase">
              Usuario Detalle
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="../user/list"
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
            >
              <Icon name="ArrowLeftCircleIcon" className="h-6 w-6" />
              Atras
            </Link>
          </div>
        </div>
        <div className="sm:mt-3 2xl:mt-4 mt-1  px-4 py-4 bg-gray-50 rounded-lg border border-gray-200">
          <dl className=" grid 2xl:grid-cols-5 sm:grid-cols-4 grid-cols-1 2xl:gap-4 sm:gap-2 gap-1">
            <div className=" ">
              <dt className="block  font-medium text-black 2xl:text-sm text-xs">
                Nombre
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user.nombres}
              </dd>
            </div>
            <div>
              <dt className="block text-sm font-medium text-gray-700">
                Nombre de Usuario
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user?.username}
              </dd>
            </div>
            <div className=" ">
              <dt className="block text-sm font-medium text-gray-700">Email</dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user?.email}
              </dd>
            </div>
            <div className="bg-blue-200 rounded-lg border-t border-b 2xl:col-span-5 sm:col-span-4 col-span-1 sm:mt-0 mt-1">
              <h1 className="sm:text-sm  text-xs leading-6 sm:py-1.5 py-0.5 font-medium text-gray-900 text-center">
                Información Permisos
              </h1>
            </div>

            <div className=" ">
              <dt className="block text-sm font-medium text-gray-700">
                Grupos de Permisos
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user?.groups?.map((group) => group.name).join(", ")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Permisos Individuales
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user?.permissions
                  ?.map((permission) => permission.name)
                  .join(", ")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Usuario Activo
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                <BadgeBool value={user?.is_active} />
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Usuario Administrador
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                <BadgeBool value={user?.is_admin} />
              </dd>
            </div>
            <div className="bg-blue-200 rounded-lg border-t border-b 2xl:col-span-5 sm:col-span-4 col-span-1 sm:mt-0 mt-1">
              <h1 className="sm:text-sm  text-xs leading-6 sm:py-1.5 py-0.5 font-medium text-gray-900 text-center">
                Información de Actividad
              </h1>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Último Inicio de Sesión
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {new Date(user?.last_login).toLocaleString("es-ES")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Último Editor
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {user?.last_user?.name}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Creado en
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {new Date(user?.createdAt).toLocaleString("es-ES")}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="block text-sm font-medium text-gray-700">
                Actualizado en
              </dt>
              <dd className="block  font-medium text-black 2xl:text-sm text-xs">
                {new Date(user?.updatedAt).toLocaleString("es-ES")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
