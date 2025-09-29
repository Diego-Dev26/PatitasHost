import Icon from "@/components/Icon";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "@/components/Error";
import { StoreContext } from "@/context/store";
import "./User_profile.css";
import client from "@/api";
import FilesUpload from "@/components/FilesUpload";

export default function User_form() {
  //essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [errors, set_errors] = useState([]);
  //fields
  const [user, set_user] = useState({
    nombres: "",
    primerApellido: "",
    segundoApellido: "",
    username: "",
    email: "",
    celular: "",
    direccion: "",
    password: "",
    photo_url: [],
    // firma: [],
  });

  const [repeat_password, set_repeat_password] = useState("");

  const photo_url_upload = useRef();
  // const firma_upload = useRef();

  //foreigns
  const [groups_list, set_groups_list] = useState([]);
  const [permissions_list, set_permissions_list] = useState([]);

  async function getForeigns() {
    store.setLoading(true);
    Promise.all([
      client
        .post("/group/list")
        .then((r) => set_groups_list(r?.data?.list || [])),
      client
        .post("/permission/list")
        .then((r) => set_permissions_list(r.data.list || [])),
    ]).finally(() => {
      store.setLoading(false);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let errores = [];
    if (user.password !== repeat_password)
      errores.push("Las contraseñas no coinciden");

    if (errores.length === 0) {
      store.setLoading(true);

      // 1) Subir la foto si hay nuevas
      user.photo_url = [
        ...user.photo_url,
        ...(await photo_url_upload.current.uploadFilesComponent()),
      ];

      try {
        // --- AQUI EMPIEZA LA FUSION CON VALORES ORIGINALES ---
        // 2) Obtener el usuario actual completo desde el backend
        const originalRes = await client.get("/user/me");
        const original = originalRes.data;

        // 3) Construir un payload que incluya TODOS los campos required
        const payload = {
          // Campos editables que vienen desde tu formulario
          nombres: user.nombres,
          primerApellido: user.primerApellido,
          segundoApellido: user.segundoApellido,
          username: user.username,
          email: user.email,
          password: user.password || "", // si está vacío, el back lo ignora
          photo_url: user.photo_url,

          // Si el usuario no modificó “celular”, toma el original; en caso contrario, usa el del form
          celular: user.celular || original.celular,
          // Igual con “direccion”
          direccion: user.direccion || original.direccion,
        };
        // --- AQUI TERMINA LA FUSION CON VALORES ORIGINALES ---

        // 4) Hacer el PUT enviando el payload combinado
        const r = await client.put("/user/update/update_profile", {
          user: payload,
        });

        store.updateProfile(r.data);
        store.showSuccess({
          message: "Perfil actualizado",
          redirect: "/dashboard",
          navigate,
        });
      } catch (e) {
        // Mostrar cuál validación falló en el servidor
        console.error(
          "ERROR COMPLETO DEL SERVIDOR (respuesta /user/update/update_profile):",
          e.response?.data?.error
        );
        const errorMessage =
          e?.response?.data?.message || "Error al Actualizar Perfil";
        set_errors([errorMessage]);
        store.showErrors([errorMessage]);
      } finally {
        store.setLoading(false);
      }
    } else {
      set_errors([errores[0]]);
      store.showErrors(errores);
    }
  }

  useEffect(() => {
    getForeigns();
    store.setLoading(true);
    client
      .get("/user/me", {})
      .then((r) => {
        const fetchedData = r?.data || {};
        const update = Object.keys(user).reduce((acc, key) => {
          acc[key] = fetchedData.hasOwnProperty(key)
            ? fetchedData[key]
            : user[key];
          return acc;
        }, {});
        update.password = "";
        console.log(update);
        set_user(update);
      })
      .finally(() => store.setLoading(false));
  }, []);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 uppercase">
              PERFIL DE USUARIO
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
        <div className="mt-8 px-4 py-1 bg-gray-50 rounded-lg border border-gray-200">
          <Error title="Error en el Formulario" errors={errors} />
          <form
            onSubmit={handleSubmit}
            className="space-y-8 divide-y divide-gray-200"
          >
            <div className="space-y-6 px-4 py-4">
              <div className="sm:grid sm:grid-cols-6 sm:gap-x-10 sm:gap-y-6 sm:items-start">
                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Nombres
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="50"
                    readOnly
                    name="name"
                    value={user?.nombres}
                    onChange={(e) =>
                      set_user({ ...user, nombres: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase"
                  />
                </div>
                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Nombre de Usuario
                  </label>
                  <input
                    required
                    type="text"
                    minLength="4"
                    maxLength="25"
                    name="username"
                    readOnly
                    value={user?.username}
                    onChange={(e) =>
                      set_user({ ...user, username: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                {/* ---------- Primer Apellido ---------- */}
                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="primerApellido"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Primer Apellido
                  </label>
                  <input
                    required
                    type="text"
                    name="primerApellido"
                    readOnly
                    value={user?.primerApellido || ""}
                    onChange={(e) =>
                      set_user({ ...user, primerApellido: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase"
                  />
                </div>

                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="segundoApellido"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Segundo Apellido
                  </label>
                  <input
                    required
                    type="text"
                    name="segundoApellido"
                    readOnly
                    value={user?.segundoApellido || ""}
                    onChange={(e) =>
                      set_user({ ...user, segundoApellido: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* ---------- Celular ---------- */}
                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="celular"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Celular
                  </label>
                  <input
                    required
                    type="text"
                    name="celular"
                    readOnly
                    value={user?.celular || ""}
                    onChange={(e) =>
                      set_user({ ...user, celular: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="direccion"
                    className="block text-sm font-medium text-gray-800"
                  >
                    Direccion
                  </label>
                  <input
                    required
                    type="text"
                    name="direccion"
                    readOnly
                    value={user?.direccion || ""}
                    onChange={(e) =>
                      set_user({ ...user, direccion: e.target.value })
                    }
                    className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="mt-1 sm:mt-0 sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Icon
                        name="EnvelopeIcon"
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      readOnly
                      value={user?.email}
                      onChange={(e) =>
                        set_user({ ...user, email: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* <div className="mt-1 sm:mt-0 sm:col-span-3">
                                    <FilesUpload label="Firma" name="firma_url" files={user?.firma} setFiles={e => set_user({ ...user, firma: e })} ref={firma_upload} accept="images/*" maxFiles={1} />
                                </div> * */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
