import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "@/context/store";
import './Group_delete.css';
import client from "@/api";

export default function Group_delete() {
    //essentials
    const { id } = useParams();
    const store = useContext(StoreContext);
    const navigate = useNavigate();
    const [group, set_group] = useState({});
    const populate = ['permissions', 'last_user'];

    function deleteGroup() {
        store.setLoading(true);
        client.delete(`/group/delete/${id}`).then(r => {
            store.showSuccess({ message: "Registro Eliminado", redirect: "/dashboard/group/list", navigate });
        }).catch(e => {
            store.showErrors(["Error al Eliminar el Registro"]);
        }).finally(() => store.setLoading(false));
    }

    useEffect(() => {
        store.setLoading(true);
        if (id) {
            store.setLoading(true);
            client.post('/group/read', {
                query: {
                    find: { _id: id },
                    populate,
                }
            }).then(r => {
                set_group(r?.data);
            }).finally(() => store.setLoading(false));
        }
    }, [])

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 uppercase">ELIMINAR GRUPO</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="../group/list"
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <Icon name="ArrowLeftCircleIcon" className="h-6 w-6" />
                            Atras
                        </Link>
                    </div>
                </div>
                <div className="mt-8 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-lg mt-2 max-w-xl text-2xl text-gray-500">
                        <p>
                            Esta seguro de Eliminar el registro?
                        </p>
                    </div>
                    <div className="mt-5">
                        <button type="button" onClick={deleteGroup} className="text-lg inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                            Eliminar Grupo
                        </button>
                    </div>

                    <dl className="mt-5 ml-8 pb-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Nombre del Grupo
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {group?.name}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Permisos
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {group?.permissions?.map(permission => permission.name).join(", ")}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Último Editor
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {group?.last_user?.name}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Creado en
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {new Date(group?.createdAt).toLocaleString("es-ES")}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Actualizado en
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {new Date(group?.updatedAt).toLocaleString("es-ES")}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    )
}