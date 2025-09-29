import { useContext, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { Link } from "react-router-dom";
import OptionsRUD from "@/components/OptionsRUD";
import SearchBar from "@/components/SearchBar";
import BadgeBool from "@/components/BadgeBool";
import "./User_list.css";
import { StoreContext } from "@/context/store";
import client from "@/api";
import EntriesSelect from "@/components/EntriesSelect";

const headers = [
  { name: "Nombre", field: "name" },
  { name: "Nombre de Usuario", field: "username" },
  { name: "Email", field: "email" },
  { name: "Administrador", field: "is_admin" },
  { name: "Activo", field: "is_active" },
];

function User_list() {
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
  const populate = ["groups", "permissions", "last_user"];

  function getList(query) {
    store.setLoading(true);
    client
      .post("/user/list", {
        query: {
          ...query,
          populate,
          //select
        },
      })
      .then((r) => {
        setList(r.data.list);
        if (r?.data?.count) {
          setTotal(r.data.count);
          setMaxPage(Math.ceil(r.data.count / docForPage));
        }
      })
      .finally(() => {
        store.setLoading(false);
      });
  }

  function handleDocPerPageChange(e) {
    const newLimit = Number(e); // Asegúrate de que el valor sea un número
    setDocForPage(newLimit);
    setPage(1); // Reinicia la paginación a la primera página
    getList({
      page: 1,
      limit: newLimit, // Usa el nuevo límite de documentos por página
      search: find,
      sort: sort,
      count: true, // Asegura que actualizamos el conteo total
    });
  }

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
      count: true,
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
          count: false,
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
          count: false,
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
      count: true,
    });
  }

  useEffect(() => {
    var temp = {};
    temp.read = store.checkPermissions(["read_user"]);
    temp.update = store.checkPermissions(["update_user"]);
    temp.delete = store.checkPermissions(["delete_user"]);
    set_permissions(temp);
    getList({
      page: page,
      limit: docForPage,
      count: true,
    });
  }, []);

  return (
    <>
      <div className="px-2  py-1 sm:py-2 xl:py-4 ">
        <div className="bg-gray-50 px-1  py-0.5 sm:py-0.5 2xl:py-1  sm:flex flex flex-wrap-reverse sm:items-center w-full">
          <div className="sm:flex-auto">
            <h1 className="text-balance 2xl:text-xl sm:text-lg text-sm  mt-2 sm:mt-0 font-semibold text-gray-900 uppercase">
              Lista de Usuarios
            </h1>
          </div>
          <div className=" ml-6 sm:ml-0  flex-none ">
            {store.checkPermissions(["create_user"]) && (
              <Link
                to="../user/create"
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 2xl:px-4 lg:px-2  py-2 2xl:text-sm sm:text-xs text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
              >
                <Icon
                  name="PlusCircleIcon"
                  className="2xl:h-6 2xl:w-6 sm:mr-4 mr-1 sm:h-5 sm:w-5 h-4 w-4"
                />
                Añadir Usuario
              </Link>
            )}
          </div>
        </div>
        <div className="rounded-lg flow-root">
          <div className="inline-block max-w-full min-w-full  align-middle ">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowra">
              <div className="flex items-center">
                <div className="ml-2 text-xs sm:text-sm">
                  <EntriesSelect
                    options={[
                      { _id: 10, name: "10 / Pág." },
                      { _id: 50, name: "50 / Pág." },
                      { _id: 100, name: "100 / Pág." },
                      { _id: 200, name: "200 / Pág." },
                      { _id: 500, name: "500 / Pág." },
                    ]}
                    value={docForPage}
                    setValue={(e) => handleDocPerPageChange(e)} // Asegúrate de que se llama con el valor seleccionado
                    className="-mt-0 text-balance"
                  />
                </div>
              </div>
              <div className="shadow-sm">
                <SearchBar
                  fields={[
                    { id: "name", name: "Nombre Completo", type: "string" },
                    {
                      id: "username",
                      name: "Nombre de Usuario",
                      type: "string",
                    },
                    { id: "groups", name: "Grupos", type: "string" },
                    { id: "permissions", name: "Permisos", type: "string" },
                    { id: "is_admin", name: "Administrador", type: "boolean" },
                    { id: "is_active", name: "Activo", type: "boolean" },
                    {
                      id: "last_login",
                      name: "Ultimo Inicio de Sesión",
                      type: "date",
                    },
                    { id: "last_user", name: "Ultimo Editor", type: "string" },
                    {
                      id: "createdAt",
                      name: "Creado en",
                      type: "datetime-local",
                    },
                    {
                      id: "updatedAt",
                      name: "Actualizado en",
                      type: "datetime-local",
                    },
                  ]}
                  search={(e) => search(e)}
                />
              </div>
            </div>
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg w-full ">
              <table className="table-fixed divide-y-2 divide-gray-300 min-w-full align-middle">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="w-1/12 py-3.5 pl-4 pr-1 sm:pr-2 2xl:pr-3 text-left 2xl:text-sm text-xs font-semibold text-gray-900 sm:pl-6"
                    >
                      Nro
                    </th>
                    {headers.map((h) => (
                      <th
                        key={h.name}
                        className="w-2/12 whitespace-nowrap  pr-1 sm:pr-2 2xl:pr-3   2xl:text-sm text-xs font-semibold text-gray-900  text-balance"
                      >
                        <button
                          className="flex items-center justify-center pl-2 pr-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => sortColumn(h.field)}
                        >
                          {h.name}
                          {!sort?.[h.field] && (
                            <Icon
                              name="ArrowsUpDownIcon"
                              className="h-4 pl-2"
                            />
                          )}
                          {sort?.[h.field] === 1 && (
                            <Icon name="ArrowUpIcon" className="h-4 pl-2" />
                          )}
                          {sort?.[h.field] === -1 && (
                            <Icon name="ArrowDownIcon" className="h-4 pl-2" />
                          )}
                        </button>
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="relative w-2/12 px-4 py-2  text-xs font-medium text-gray-500 uppercase "
                    >
                      <span className="sr-only">Opciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="ddivide-y divide-gray-200 bg-white 2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1">
                  {list.length > 0 ? (
                    list.map((user, index) => (
                      <tr key={user._id} className="even:bg-gray-50">
                        <td className="py-4 pl-4 pr-3 text-xs font-medium text-gray-900">
                          {index + 1 + (page - 1) * docForPage}
                        </td>
                        <td className="2xl:text-sm text-xs text-gray-500">
                          {user.nombres}
                        </td>
                        <td className="2xl:text-sm text-xs text-gray-500">
                          {user.username}
                        </td>
                        <td className="2xl:text-sm text-xs text-gray-500">
                          {user.email}
                        </td>

                        <td className=" 2xl:text-sm text-xs text-gray-500">
                          <BadgeBool value={user.is_admin} />
                        </td>
                        <td className=" 2xl:text-sm text-xs text-gray-500">
                          <BadgeBool value={user.is_active} />
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium">
                          <OptionsRUD
                            id={user._id}
                            model="user"
                            permissions={permissions}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={headers.length + 2}
                        className="py-4 text-center text-gray-500"
                      >
                        <h1>No existen registros</h1>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-medium">
                    {(page - 1) * docForPage + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-medium">
                    {page == maxPage ? total : page * docForPage}
                  </span>{" "}
                  de <span className="font-medium">{total}</span> resultados
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  onClick={() => navPage(false)}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 2xl:text-sm text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => navPage(true)}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2  2xl:text-sm text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default User_list;
