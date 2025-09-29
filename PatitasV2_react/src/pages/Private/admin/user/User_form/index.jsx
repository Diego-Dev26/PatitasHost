import Icon from "@/components/Icon";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "@/components/Error";
import MultiCheckbox from "@/components/Multicheckbox";
import Toggle from "@/components/Toggle";
import { StoreContext } from "@/context/store";
import "./User_form.css";
import client from "@/api";

export default function User_form() {
  // Essentials
  const { id } = useParams();
  const store = useContext(StoreContext);
  const navigate = useNavigate();
  const [errors, set_errors] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    set_user({ ...user, password: val });

    // Validar formato en tiempo real
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordPattern.test(val)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial, sin espacios."
      );
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fields
  const [user, set_user] = useState({
    nombres: "",
    primerApellido: "",
    segundoApellido: "",
    username: "",
    email: "",
    celular: "",
    direccion: "",
    password: "",
    groups: [],
    permissions: [],
    is_admin: false,
    is_active: true,
  });

  const [repeat_password, set_repeat_password] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  // Foreigns
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

  // Validation patterns
  const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  const usernamePattern = /^[A-Za-z0-9]{8,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const celularPattern = /^[67]\d{7}$/;
  const direccionPattern = /^(?! ).*(?<! )$/; // no inicia ni termina con espacio, y no dobles espacios
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  function handleSubmit(e) {
    e.preventDefault();
    const errs = [];

    // Nombres
    if (!user.nombres.trim()) {
      errs.push("El campo Nombres es obligatorio");
    } else if (!namePattern.test(user.nombres)) {
      errs.push("Nombres solo permite letras y un solo espacio intermedio");
    }

    // Primer Apellido
    if (!user.primerApellido.trim()) {
      errs.push("El campo Primer Apellido es obligatorio");
    } else if (!namePattern.test(user.primerApellido)) {
      errs.push(
        "Primer Apellido solo permite letras y un solo espacio intermedio"
      );
    }

    // Segundo Apellido (opcional, pero si existe debe cumplir patrón)
    if (user.segundoApellido && !namePattern.test(user.segundoApellido)) {
      errs.push(
        "Segundo Apellido solo permite letras y un solo espacio intermedio"
      );
    }

    // Usuario
    if (!user.username) {
      errs.push("El Nombre de Usuario es obligatorio");
    } else if (!usernamePattern.test(user.username)) {
      errs.push(
        "Nombre de Usuario debe tener mínimo 8 caracteres, solo letras y números, sin espacios"
      );
    }

    // Email
    if (!user.email) {
      errs.push("El Email es obligatorio");
    } else if (!emailPattern.test(user.email)) {
      errs.push("El formato de Email no es válido");
    }

    // Celular
    if (!user.celular) {
      errs.push("El Celular es obligatorio");
    } else if (!celularPattern.test(user.celular)) {
      errs.push(
        "Celular debe comenzar con 6 o 7 y tener exactamente 8 dígitos, solo números"
      );
    }

    // Dirección
    if (!user.direccion.trim()) {
      errs.push("El campo Dirección es obligatorio");
    } else if (!direccionPattern.test(user.direccion)) {
      errs.push(
        "Dirección no puede iniciar ni terminar con espacio, ni tener dobles espacios"
      );
    }

    // Contraseña (solo al crear)
    if (!id) {
      if (!password) {
        errs.push("La Contraseña es obligatoria");
      } else if (!passwordPattern.test(password)) {
        errs.push(
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial, sin espacios."
        );
      }

      // Repetir Contraseña
      if (password !== repeat_password) {
        errs.push("Las contraseñas no coinciden");
      }
    }

    if (errs.length === 0) {
      store.setLoading(true);
      if (id) {
        client
          .put(`/user/update/${id}`, { user })
          .then(() => {
            store.showSuccess({
              message: "Usuario Actualizado",
              redirect: "/dashboard/user/list",
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
          .post(`/user/create`, { user })
          .then(() => {
            store.showSuccess({
              message: "Usuario Creado",
              redirect: "/dashboard/user/list",
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
      set_errors([errs[0]]);
      store.showErrors(errs);
    }
  }

  useEffect(() => {
    getForeigns();
    if (id) {
      store.setLoading(true);
      client
        .post("/user/read", {
          query: {
            find: { _id: id },
          },
        })
        .then((r) => {
          const fetchedData = r?.data || {};
          const update = Object.keys(user).reduce((acc, key) => {
            acc[key] = fetchedData.hasOwnProperty(key)
              ? fetchedData[key]
              : user[key];
            return acc;
          }, {});
          set_user(update);
          setPassword(update.password || "");
        })
        .finally(() => store.setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Only letters + single space
  const handleNameKeyDown = (e) => {
    const key = e.key;
    if (key.length > 1) return;
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]$/.test(key)) {
      e.preventDefault();
      return;
    }
    if (key === " ") {
      const { value, selectionStart } = e.target;
      if (selectionStart === 0 || value[selectionStart - 1] === " ") {
        e.preventDefault();
      }
    }
  };
  const handleNamePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (
      !/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(paste) ||
      paste.startsWith(" ") ||
      /\s{2,}/.test(paste)
    ) {
      e.preventDefault();
    }
  };

  // No spaces, only alphanumeric for username
  const handleUsernameKeyDown = (e) => {
    const key = e.key;
    if (key.length > 1) return;
    if (!/^[A-Za-z0-9]$/.test(key)) e.preventDefault();
  };
  const handleUsernamePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^[A-Za-z0-9]+$/.test(paste)) e.preventDefault();
  };

  // No spaces in email
  const handleEmailKeyDown = (e) => {
    if (e.key === " ") e.preventDefault();
  };
  const handleEmailPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (paste.includes(" ")) e.preventDefault();
  };

  // Celular: primer dígito 6 o 7, luego 7 dígitos más
  const handleCelularKeyDown = (e) => {
    const key = e.key;
    const { value, selectionStart } = e.target;
    // permitir teclas de control
    if (key.length > 1) return;

    // si es el primer carácter, solo 6 o 7
    if (selectionStart === 0) {
      if (!/^[67]$/.test(key)) {
        e.preventDefault();
      }
    } else {
      // para posiciones posteriores, solo dígitos
      if (!/^[0-9]$/.test(key)) {
        e.preventDefault();
      }
    }
  };
  const handleCelularPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    // si no tiene exactamente 8 dígitos o no empieza con 6/7 o contiene no dígitos, cancelar
    if (!/^[67]\d{7}$/.test(paste)) {
      e.preventDefault();
    }
  };
  const handleCelularBlur = (e) => {
    const val = e.target.value;
    if (!celularPattern.test(val)) {
      set_errors([
        "Celular debe comenzar con 6 o 7 y tener exactamente 8 dígitos, solo números",
      ]);
    }
  };

  // Allow all chars but single spaces only in dirección
  const handleDireccionKeyDown = (e) => {
    const key = e.key;
    if (key === " ") {
      const { value, selectionStart } = e.target;
      if (selectionStart === 0 || value[selectionStart - 1] === " ") {
        e.preventDefault();
      }
    }
  };
  const handleDireccionPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (paste.startsWith(" ") || /\s{2,}/.test(paste)) e.preventDefault();
  };

  // No spaces in password
  const handlePasswordKeyDown = (e) => {
    if (e.key === " ") e.preventDefault();
  };
  const handlePasswordPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (paste.includes(" ")) e.preventDefault();
  };

  return (
    <>
      <div className="px-2 py-1 sm:py-2 xl:py-4">
        <div className="bg-gray-50 px-1  py-0.5 sm:py-0.5 2xl:py-1  sm:flex flex flex-wrap-reverse sm:items-center w-full">
          <div className="sm:flex-auto">
            <h1 className="ttext-balance 2xl:text-xl sm:text-lg text-sm  mt-2 sm:mt-0 font-semibold text-gray-900 uppercase">
              {id ? "EDITAR USUARIO" : "REGISTRAR USUARIO"}
            </h1>
          </div>
          <div className="ml-8 sm:ml-0  flex-none">
            <Link
              to="../user/list"
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
              <div className="grid 2xl:grid-cols-5 sm:grid-cols-4 grid-cols-1 2xl:gap-4 sm:gap-2 gap-1">
                <div className="bg-blue-200 rounded-lg border-t border-b 2xl:col-span-5 sm:col-span-4 col-span-1">
                  <h1 className="sm:text-sm  text-xs leading-6 sm:py-1.5 py-0.5 font-medium text-gray-900 text-center">
                    Información Personal
                  </h1>
                </div>
                {/* Nombres */}
                <div>
                  <label
                    htmlFor="nombres"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Nombres
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="50"
                    name="nombres"
                    value={user.nombres}
                    onChange={(e) =>
                      set_user({ ...user, nombres: e.target.value })
                    }
                    onKeyDown={handleNameKeyDown}
                    onPaste={handleNamePaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* Primer Apellido */}
                <div>
                  <label
                    htmlFor="primerApellido"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Primer Apellido
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="50"
                    name="primerApellido"
                    value={user.primerApellido}
                    onChange={(e) =>
                      set_user({ ...user, primerApellido: e.target.value })
                    }
                    onKeyDown={handleNameKeyDown}
                    onPaste={handleNamePaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* Segundo Apellido */}
                <div>
                  <label
                    htmlFor="segundoApellido"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    maxLength="50"
                    name="segundoApellido"
                    value={user.segundoApellido}
                    onChange={(e) =>
                      set_user({ ...user, segundoApellido: e.target.value })
                    }
                    onKeyDown={handleNameKeyDown}
                    onPaste={handleNamePaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Nombre de Usuario
                  </label>
                  <input
                    required
                    type="text"
                    minLength="8"
                    maxLength="25"
                    name="username"
                    value={user.username}
                    onChange={(e) =>
                      set_user({ ...user, username: e.target.value })
                    }
                    onKeyDown={handleUsernameKeyDown}
                    onPaste={handleUsernamePaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Email
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Icon
                        name="EnvelopeIcon"
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      required
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={(e) =>
                        set_user({ ...user, email: e.target.value })
                      }
                      onKeyDown={handleEmailKeyDown}
                      onPaste={handleEmailPaste}
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      className="pl-10 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                    />
                  </div>
                </div>
                {/* Celular */}
                <div>
                  <label
                    htmlFor="celular"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Celular
                  </label>
                  <input
                    required
                    type="text"
                    name="celular"
                    value={user.celular}
                    onChange={(e) =>
                      set_user({ ...user, celular: e.target.value })
                    }
                    onKeyDown={handleCelularKeyDown}
                    onPaste={handleCelularPaste}
                    onBlur={handleCelularBlur}
                    maxLength="8"
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md"
                  />
                </div>
                {/* Dirección */}
                <div>
                  <label
                    htmlFor="direccion"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Dirección
                  </label>
                  <input
                    required
                    type="text"
                    name="direccion"
                    value={user.direccion}
                    onChange={(e) =>
                      set_user({ ...user, direccion: e.target.value })
                    }
                    onKeyDown={handleDireccionKeyDown}
                    onPaste={handleDireccionPaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                </div>
                {/* Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Contraseña
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required={!id}
                      onKeyDown={handlePasswordKeyDown}
                      onPaste={handlePasswordPaste}
                      minLength={8}
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
                      className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md pe-10 uppercase"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <Icon
                        name={showPassword ? "EyeIcon" : "EyeSlashIcon"}
                        className="h-5 w-5 text-gray-500"
                      />
                    </div>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                  )}
                </div>
                {/* Repetir Contraseña */}
                <div>
                  <label
                    htmlFor="repeat_password"
                    className="block font-medium text-black 2xl:text-sm text-xs"
                  >
                    Repita la Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="repeat_password"
                    value={repeat_password}
                    onChange={(e) => {
                      set_repeat_password(e.target.value);
                      if (password !== e.target.value) {
                        setRepeatPasswordError("Las contraseñas no coinciden");
                      } else {
                        setRepeatPasswordError("");
                      }
                    }}
                    required={!id}
                    onKeyDown={handlePasswordKeyDown}
                    onPaste={handlePasswordPaste}
                    className="focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm 2xl:text-sm text-xs border-gray-300 rounded-md uppercase"
                  />
                  {repeatPasswordError && (
                    <p className="mt-1 text-xs text-red-500">
                      {repeatPasswordError}
                    </p>
                  )}
                </div>

                <div className="bg-blue-200 rounded-lg border-t border-b 2xl:col-span-5 sm:col-span-4 col-span-1 sm:mt-0 mt-1">
                  <h1 className="sm:text-sm  text-xs leading-6 sm:py-1.5 py-0.5 font-medium text-gray-900 text-center">
                    Información Permisos
                  </h1>
                </div>
                {/* Usuario Activo */}
                <div className="col-span-1">
                  <Toggle
                    label="Usuario Activo"
                    value={user.is_active}
                    setValue={(e) => set_user({ ...user, is_active: e })}
                  />
                </div>
                {/* Usuario Administrador */}
                <div className="col-span-1">
                  <Toggle
                    label="Usuario Administrador"
                    value={user.is_admin}
                    setValue={(e) => set_user({ ...user, is_admin: e })}
                  />
                </div>
                {/* Grupos de Permisos */}
                <div className="2xl:col-span-5 sm:col-span-4 col-span-1 border-b-4 border-gray-200">
                  <MultiCheckbox
                    label="Grupos de Permisos"
                    options={groups_list}
                    values={user.groups}
                    setValues={(e) => set_user({ ...user, groups: e })}
                  />
                </div>
                {/* Permisos Individuales */}
                <div className="2xl:col-span-5 sm:col-span-4 col-span-1 border-b-4 border-gray-200">
                  <MultiCheckbox
                    label="Permisos Individuales"
                    options={permissions_list}
                    values={user.permissions}
                    setValues={(e) => set_user({ ...user, permissions: e })}
                    cols={5}
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
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
