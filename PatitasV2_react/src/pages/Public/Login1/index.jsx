import { useContext, useEffect, useState } from "react";
import Logo from "@/assets/logo.png";
import "./Login.css";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { StoreContext } from "@/context/store";
import { Link, Navigate, useNavigate } from "react-router-dom";
import client from "@/api";

function Login() {
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");
  const [errors, setErrors] = useState([]);
  const [loginSuccess, set_loginSuccess] = useState(false);
  const [oauthLogin, set_oauthLogin] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!username && username != "") {
      setErrors(["Porfavor ingrese su nombre de Usuario"]);
      return;
    }
    if (!password && password != "") {
      setErrors(["Porfavor ingrese la contraseña"]);
      return;
    }
    store.setLoading(true);
    client
      .post("/user/login", {
        username,
        password,
      })
      .then((r) => {
        store.login(r.data);
      })
      .catch((e) => {
        store.setLoading(false);
        store.showErrors([e.response.data.message]);
        setErrors([e.response.data.message]);
      });
  }
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/authGoogle/google";
  };

  useEffect(() => {
    if (store.user) {
      store.setLoading(false);

      const expectedPermissions = [
        "create_adopcion",
        "read_adopcion",
        "update_adopcion",
        "delete_adopcion",
        "create_denuncia",
        "read_denuncia",
        "update_denuncia",
        "delete_denuncia",
        "create_historial",
        "read_historial",
        "update_historial",
        "delete_historial",
        "create_mascota",
        "read_mascota",
        "update_mascota",
        "delete_mascota",
      ];

      const userPermissions = store.user?.all_permissions || [];

      const hasOnlyExpectedPermissions =
        userPermissions.length === expectedPermissions.length &&
        expectedPermissions.every((p) => userPermissions.includes(p));

      if (hasOnlyExpectedPermissions) {
        navigate("/commun-user");
      } else {
        set_loginSuccess(true); // irá a /dashboard
      }
    }
  }, [store.user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedUserData = urlParams.get("user");
    const encodedToken = urlParams.get("token");

    if (encodedUserData && encodedToken) {
      set_oauthLogin(true);
      const user = JSON.parse(atob(encodedUserData));
      const token = atob(encodedToken);
      set_username(user.username);
      store.setLoading(true);
      setTimeout(() => {
        store.login({ user, token });
      }, 1500);
    }
  }, []);

  if (loginSuccess) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      {store.loading && <Loading />}

      <div className="min-h-screen bg-[#5D8A66] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          {/* Botón Volver al Inicio */}
          <div className="mb-4 text-left">
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="text-sm text-white bg-[#5D8A66] hover:bg-[#4b7454] px-3 py-1 rounded-md transition"
            >
              ← Volver al Inicio
            </button>
          </div>
          {/* Logo y Título */}
          <img className="mx-auto h-32 w-auto pb-4" src={Logo} alt="Workflow" />
          <h2 className="max-w-sm pb-4 mx-auto text-3xl font-extrabold text-[#5D8A66] text-center">
            INICIAR SESIÓN
          </h2>

          {/* Errores */}
          <Error title="CREDENCIALES INVÁLIDAS" errors={errors} />

          {/* Formulario */}
          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => set_username(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border-b border-gray-400 bg-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
              />
            </div>

            {!oauthLogin && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => set_password(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border-b border-gray-400 bg-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#5D8A66] text-white py-2 rounded-lg hover:bg-[#4b7454] transition"
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              className="w-full mt-2 text-green-700 hover:underline"
            >
              No tengo una cuenta
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
