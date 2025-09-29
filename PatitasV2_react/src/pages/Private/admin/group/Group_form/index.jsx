import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from '@/components/Error';
import MultiCheckbox from "@/components/Multicheckbox";
import { StoreContext } from "@/context/store";
import './Group_form.css';
import client from "@/api";

export default function Group_form() {
    //essentials
    const { id } = useParams();
    const store = useContext(StoreContext);
    const navigate = useNavigate();
    const [errors, set_errors] = useState([]);
    //fields
    const [group, set_group] = useState({
        name: '',
        permissions: [],
    });

    //foreigns
    const [permissions_list, set_permissions_list] = useState([]);

    async function getForeigns() {
        store.setLoading(true);
        Promise.all([
            client.post('/permission/list').then(r => set_permissions_list(r.data.list)),
        ]).finally(() => {
            store.setLoading(false);
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        var errors = [];
        //Otros Validadores
        if (errors.length == 0) {
            store.setLoading(true);
            if (id) {
                client.put(`/group/update/${id}`, { group }).then(r => {
                    store.showSuccess({ message: "Grupo Actualizado", redirect: "/dashboard/group/list", navigate });
                }).catch(e => {
                    if (e?.response?.data?.message) {
                        set_errors([e?.response?.data?.message]);
                        store.showErrors([e?.response?.data?.message]);
                    }
                }).finally(() => store.setLoading(false));
            } else {
                client.post(`/group/create`, { group }).then(r => {
                    store.showSuccess({ message: "Grupo Creado", redirect: "/dashboard/group/list", navigate });
                }).catch(e => {
                    if (e?.response?.data?.message) {
                        set_errors([e?.response?.data?.message]);
                        store.showErrors([e?.response?.data?.message]);
                    }
                }).finally(() => store.setLoading(false));
            }
        } else {
            set_errors([errors[0]]);
            store.showErrors([errors]);
        }
    }

    useEffect(() => {
        getForeigns();
        if (id) {
            store.setLoading(true);
            client.post('/group/read', {
                query: {
                    find: { _id: id },
                }
            }).then(r => {
                const fetchedData = r?.data || {};
                const update = Object.keys(group).reduce((acc, key) => {
                    acc[key] = fetchedData.hasOwnProperty(key) ? fetchedData[key] : group[key];
                    return acc;
                }, {});
                set_group(update);
            }).finally(() => store.setLoading(false))
        }
    }, []);

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 uppercase">{id ? "EDITAR GRUPO" : "REGISTRAR GRUPO"}</h1>
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
                    <Error title="Error en el Formulario" errors={errors} />
                    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                        <div className="space-y-6 px-4 py-4">
                            <div className="sm:grid sm:grid-cols-6 sm:gap-x-10 sm:gap-y-6 sm:items-start">
                                <div className="bg-blue-200 rounded-lg border-t border-b sm:col-span-6">
                                    <h1 className="text-md ml-8 leading-6 py-2 font-medium text-gray-900 text-center">Información Personal</h1>
                                </div>
                                <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                                        Nombre de Grupo
                                    </label>
                                    <input required type="text" minLength="4" maxLength="25" name="name" value={group?.name} onChange={e => set_group({ ...group, name: e.target.value })} className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                </div>
                                <div className="mt-1 sm:mt-0 sm:col-span-6">
                                    <MultiCheckbox label="Permisos" options={permissions_list} values={group?.permissions} setValues={(e) => set_group({ ...group, permissions: e })} cols={5} />
                                </div>
                            </div>
                        </div>
                        <div className="pt-5">
                            <div className="flex justify-end">
                                <Link
                                    to="../group/list"
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
    )
}