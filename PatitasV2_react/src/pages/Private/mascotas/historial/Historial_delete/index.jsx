//initJSesterilizacion
import BadgeBool from "@/components/BadgeBool";

//endJSesterilizacion
import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "@/context/store";
import './Historial_delete.css';
import client from "@/api";

export default function Historial_delete() {
    //essentials
    const { id } = useParams();
    const store = useContext(StoreContext);
    const navigate = useNavigate();
    const [historial, set_historial] = useState({});
    const populate = [
        //initJSid_mascota
"id_mascota",
//endJSid_mascota
//foreigns
        "last_user",
    ];

    function deleteHistorial() {
        store.setLoading(true);
        client.delete(`/historial/delete/${id}`).then(r => {
            store.showSuccess({ message: "Registro Eliminado", redirect: "/dashboard/historial/list", navigate });
        }).catch(e => {
            store.showErrors(["Error al Eliminar el Registro"]);
        }).finally(() => store.setLoading(false));
    }

    useEffect(() => {
        store.setLoading(true);
        if (id) {
            store.setLoading(true);
            client.post('/historial/read', {
                query: {
                    find: { _id: id },
                    populate,
                }
            }).then(r => {
                set_historial(r?.data);
            }).finally(() => store.setLoading(false));
        }
    }, [])

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 uppercase">ELIMINAR Historial</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="../historial/list"
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
                        <p>
                            ¿Está seguro de eliminar el registro?
                        </p>
                    </div>
                    <div className="mt-5">
                        <button type="button" onClick={deleteHistorial} className="text-lg inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                            Eliminar Historial
                        </button>
                    </div>

                    <dl className=" grid 2xl:grid-cols-5 sm:grid-cols-4 grid-cols-1 2xl:gap-4 sm:gap-2 gap-1">
                        {/* initJSXid_mascota */}

        <div className=" ">
            <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Mascota
            </dt>
            <dd className="block font-medium text-black 2xl:text-sm text-xs">
                {historial?.id_mascota?.nombre}
            </dd>
        </div>
        
{/* endJSXid_mascota */}
{/* initJSXesterilizacion */}

        <div className=" ">
            <dt className="block font-medium text-black 2xl:text-sm text-xs">
                Esterilizacion
            </dt>
            <dd className="block font-medium text-black 2xl:text-sm text-xs">
                {<BadgeBool value={historial?.esterilizacion} si='Esterilizado' no='No' />}
            </dd>
        </div>
        
{/* endJSXesterilizacion */}
{/* initJSXvacunas */}

            <div className="">
                <dt className="block font-medium text-black 2xl:text-sm text-xs">
                    Vacunas
                </dt>
                <dd className="block font-medium text-black 2xl:text-sm text-xs" style={{ whiteSpace: 'pre-wrap' }}>
                    {historial?.vacunas}
                </dd>
            </div>
            
{/* endJSXvacunas */}
{/* initJSXdescripcion */}

            <div className="">
                <dt className="block font-medium text-black 2xl:text-sm text-xs">
                    Descripcion
                </dt>
                <dd className="block font-medium text-black 2xl:text-sm text-xs" style={{ whiteSpace: 'pre-wrap' }}>
                    {historial?.descripcion}
                </dd>
            </div>
            
{/* endJSXdescripcion */}
{/* fieldsDetail */}
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Último Editor
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {historial?.last_user?.name}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Creado en
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {new Date(historial?.createdAt).toLocaleString("es-ES")}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="block text-sm font-medium text-gray-700">
                                Actualizado en
                            </dt>
                            <dd className="mt-1 block w-full shadow-sm sm:text-sm border-y-400 text-blue-800 rounded-md">
                                {new Date(historial?.updatedAt).toLocaleString("es-ES")}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}