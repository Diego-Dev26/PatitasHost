import { useContext, useEffect, useState } from "react";
import Icon from '@/components/Icon'
import { Link } from "react-router-dom";
import OptionsRUD from "@/components/OptionsRUD";
import SearchBar from "@/components/SearchBar";
import BadgeBool from "@/components/BadgeBool";
import './Group_list.css';
import { StoreContext } from "@/context/store";
import client from "@/api";
import EntriesSelect from "@/components/EntriesSelect";

const headers = [
    { name: "Nombre", field: "name" },
];

function Group_list() {
    const store = useContext(StoreContext);
    const [docForPage, setDocForPage] = useState(10);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [sort, setSort] = useState(null);
    const [total, setTotal] = useState(0);
    const [list, setList] = useState([]);
    const [find, setFind] = useState({});
    const [permissions, set_permissions] = useState({});
    const select = [];
    const populate = ["permissions"];

    function getList(query) {
        store.setLoading(true);
        client.post('/group/list', {
            query: {
                ...query,
                populate,
                //select
            },
        }).then(r => {
            setList(r.data.list);
            setTotal(r.data.count);
            setMaxPage(Math.ceil(r.data.count / docForPage));
        }).finally(() => {
            store.setLoading(false);
        });
    }

    function handleDocPerPageChange(e) {
        setDocForPage(Number(e));
        setPage(1);
        getList({
            page: 1,
            limit: Number(e),
            search: find,
            sort: sort,
            count: true
        });
    };

    function sortColumn(field) {
        var value = sort?.[field];
        if (!value) value = 1;
        else {
            value = value == 1 ? -1 : 1;
        }
        var newSort = {};
        newSort[field] = value;
        setSort({ ...newSort });
        setPage(1);
        getList({
            page: 1,
            limit: docForPage,
            search: find,
            sort: newSort,
            count: true
        });
    }


    function navPage(next) {
        if (next) {
            if (page < maxPage) {
                getList({
                    search: find,
                    page: page + 1,
                    limit: docForPage,
                    sort: sort,
                    count: false
                });
                setPage(page + 1);
            }
        } else {
            if (page > 1) {
                getList({
                    search: find,
                    page: page - 1,
                    limit: docForPage,
                    sort: sort,
                    count: false
                });
                setPage(page - 1);
            }
        }
    }

    function search(obj) {
        setFind(obj);
        setPage(1);
        getList({
            page: 1,
            limit: docForPage,
            search: obj,
            count: true
        });
    }

    useEffect(() => {
        var temp = {};
        temp.read = store.checkPermissions(["read_group"]);
        temp.update = store.checkPermissions(["update_group"]);
        temp.delete = store.checkPermissions(["delete_group"]);
        set_permissions(temp);
        getList({
            page: page,
            limit: docForPage,
            count: true
        });
    }, [])

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 uppercase">Lista de Grupos</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        {store.checkPermissions(['create_group']) &&
                            <Link
                                to="../group/create"
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                            >
                                <Icon name="PlusCircleIcon" className="h-6 w-6" />
                                Añadir Grupo
                            </Link>
                        }
                    </div>
                </div>
                <div className="z-0 mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <Link
                                        to="../group/report"
                                        type="button"
                                        className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    >
                                        <Icon name="PrinterIcon" className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                                        Reporte
                                    </Link>
                                    <div className="ml-1">
                                        <EntriesSelect options={[
                                            { _id: 10, name: "10 / Pág." },
                                            { _id: 50, name: "50 / Pág." },
                                            { _id: 100, name: "100 / Pág." },
                                            { _id: 200, name: "200 / Pág." },
                                            { _id: 500, name: "500 / Pág." },
                                        ]} value={docForPage} setValue={handleDocPerPageChange} className="-mt-0" />
                                    </div>
                                </div>
                                <div>
                                    <SearchBar
                                        fields={[
                                            { id: "name", name: "Nombre del Grupo", type: "string" },
                                            { id: "permissions", name: "Permisos", type: "string" },
                                            { id: "createdAt", name: "Creado en", type: "datetime-local" },
                                            { id: "updatedAt", name: "Actualizado en", type: "datetime-local" },
                                        ]}
                                        search={(e) => search(e)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Nro
                                            </th>
                                            {headers.map(h =>
                                                <th key={h.name} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    <button className="flex" onClick={() => sortColumn(h.field)}>
                                                        {h.name}
                                                        {!sort?.[h.field] && <Icon name="ArrowsUpDownIcon" className="h-4" />}
                                                        {sort?.[h.field] == 1 && <Icon name="ArrowUpIcon" className="h-4" />}
                                                        {sort?.[h.field] == -1 && <Icon name="ArrowDownIcon" className="h-4" />}
                                                    </button>
                                                </th>
                                            )}
                                            <th scope="col" className="w-10 relative py-3.5">
                                                <span className="sr-only">Opciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {(list && list.length) ?
                                            list.map((group, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {(index + 1) + ((page - 1) * docForPage)}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">{group.name}</td>
                                                    <td className="absolute py-4 pl-3 pr-4 text-sm font-medium">
                                                        <OptionsRUD id={group._id} model="group" permissions={permissions} />
                                                    </td>
                                                </tr>
                                            )) :
                                            <tr>
                                                <td className="py-4 text-center" colSpan={headers.length + 2}><h1>No existen Registros</h1></td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                                <nav
                                    className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                                    aria-label="Pagination"
                                >
                                    <div className="hidden sm:block">
                                        <p className="text-sm text-gray-700">
                                            Mostrando <span className="font-medium">{(page - 1) * docForPage + 1}</span> a <span className="font-medium">{page == maxPage ? total : page * docForPage}</span> de{' '}
                                            <span className="font-medium">{total}</span> resultados
                                        </p>
                                    </div>
                                    <div className="flex flex-1 justify-between sm:justify-end">
                                        <button
                                            onClick={() => navPage(false)}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            onClick={() => navPage(true)}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Group_list;