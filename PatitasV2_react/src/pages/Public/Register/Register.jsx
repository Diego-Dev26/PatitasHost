import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api";
import Logo from "@/assets/logo.png";

function Register() {
  const navigate = useNavigate();
  const [permissionsList, setPermissionsList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombres: "",
    primerApellido: "",
    segundoApellido: "",
    username: "",
    email: "",
    celular: "",
    direccion: "",
    password: "",
    confirmPassword: "",
    permissions: [],
  });

  // CODENAMES por defecto
  const defaultPermissionCodenames = [
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
  // Obtener lista de permisos y filtrar los de por defecto
  useEffect(() => {
    client
      .post(
        "/permission/list",
        {},
        {
          headers: {
            "x-public-access": "true",
          },
        }
      )
      .then((res) => {
        const all = res.data?.list || [];
        const filtered = all.filter((p) =>
          defaultPermissionCodenames.includes(p.codename)
        );
        setPermissionsList(filtered);
        setForm((prev) => ({
          ...prev,
          permissions: filtered.map((p) => p._id),
        }));
      })
      .catch(() => {
        setErrors(["Error al cargar los permisos predeterminados"]);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Nombres y apellidos: sólo letras y un espacio entre palabras
  const handleNameKeyDown = (e) => {
    const key = e.key;
    if (key.length > 1) return;
    // permitir solo letras y espacio
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]$/.test(key)) {
      e.preventDefault();
      return;
    }
    const { selectionStart, value } = e.target;
    // no espacio al inicio
    if (key === " " && selectionStart === 0) {
      e.preventDefault();
      return;
    }
    // un solo espacio entre palabras
    if (key === " " && value[selectionStart - 1] === " ") {
      e.preventDefault();
    }
  };
  const handleNamePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    // debe ser solo letras y espacios simples, no inicio ni consecutivos
    if (
      !/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(paste) ||
      paste.startsWith(" ") ||
      /\s{2,}/.test(paste)
    ) {
      e.preventDefault();
    }
  };

  // Usuario, password, confirm: sin espacios
  const handleNoSpaceKeyDown = (e) => {
    if (e.key === " ") e.preventDefault();
  };
  const handleNoSpacePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (/\s/.test(paste)) e.preventDefault();
  };

  // Celular: sólo 8 dígitos, empieza en 6 o 7
  const handleCelularKeyDown = (e) => {
    const key = e.key;
    const { value, selectionStart, selectionEnd } = e.target;
    // permitir retroceso y control
    if (key.length > 1) return;
    if (!/^[0-9]$/.test(key)) {
      e.preventDefault();
      return;
    }
    // primer dígito
    if (selectionStart === 0 && !/[67]/.test(key)) {
      e.preventDefault();
      return;
    }
    // longitud máxima
    const nextValue =
      value.slice(0, selectionStart) + key + value.slice(selectionEnd);
    if (nextValue.length > 8) e.preventDefault();
  };
  const handleCelularPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^[0-9]+$/.test(paste)) {
      e.preventDefault();
      return;
    }
    const { value, selectionStart, selectionEnd } = e.target;
    const nextValue =
      value.slice(0, selectionStart) + paste + value.slice(selectionEnd);
    if (nextValue.length > 8 || !/^[67]/.test(nextValue)) e.preventDefault();
  };
  // Dirección: letras, números y un espacio tras letra, sin inicio ni dobles espacios
  // Dirección: permite caracteres especiales; solo un espacio tras caracter
  const handleDireccionKeyDown = (e) => {
    const key = e.key;
    if (key.length > 1) return;
    const { selectionStart, value } = e.target;
    // manejo de espacio
    if (key === " ") {
      if (selectionStart === 0) {
        e.preventDefault();
        return;
      }
      if (value[selectionStart - 1] === " ") {
        e.preventDefault();
      }
    }
    // otros caracteres: permitidos
  };
  const handleDireccionPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    // no inicio con espacio, no dobles espacios
    if (paste.startsWith(" ") || /\s{2,}/.test(paste)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (form.password !== form.confirmPassword) {
      setErrors(["Las contraseñas no coinciden"]);
      return;
    }

    try {
      const res = await client.post("/user/public_register", {
        user: {
          nombres: form.nombres.trim(),
          primerApellido: form.primerApellido.trim(),
          segundoApellido: form.segundoApellido.trim() || "",
          username: form.username.trim(),
          email: form.email,
          celular: form.celular.trim(),
          direccion: form.direccion,
          password: form.password,
          permissions: form.permissions,
        },
      });

      console.log("Usuario creado:", res.data);
      setSuccess(true);
      navigate("/login");
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setErrors([
        err.response?.data?.message || "Error al registrar, revise los campos",
      ]);
    }
  };
  const letterFields = ["nombres", "primerApellido", "segundoApellido"];
  return (
    <div className="min-h-screen bg-[#5D8A66] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <div>
          <img className="mx-auto h-32 w-auto pb-4" src={Logo} alt="Workflow" />
          <h2 className="max-w-sm pb-2 mx-auto text-3xl font-extrabold text-#5D8A66 text-center">
            Registrarse
          </h2>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 text-sm text-red-600">
            {errors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          {[
            { name: "nombres", placeholder: "Nombres" },
            { name: "primerApellido", placeholder: "Primer Apellido" },
            {
              name: "segundoApellido",
              placeholder: "Segundo Apellido (opcional)",
              required: false,
            },
            { name: "username", placeholder: "Nombre de Usuario" },
            { name: "email", placeholder: "Correo Electronico" },
            { name: "celular", placeholder: "Celular" },
            { name: "direccion", placeholder: "Dirección" },
            { name: "password", placeholder: "Contraseña", type: "password" },
            {
              name: "confirmPassword",
              placeholder: "Confirmar contraseña",
              type: "password",
            },
          ].map(({ name, placeholder, type = "text", required = true }) => {
            const isLetter = letterFields.includes(name);
            const common = {
              name,
              placeholder,
              type,
              required,
              value: form[name],
              onChange: handleChange,
            };
            if (letterFields.includes(name)) {
              common.onKeyDown = handleNameKeyDown;
              common.onPaste = handleNamePaste;
            }
            if (["username","email", "password", "confirmPassword"].includes(name)) {
              common.onKeyDown = handleNoSpaceKeyDown;
              common.onPaste = handleNoSpacePaste;
            }
            if (name === "celular") {
              common.onKeyDown = handleCelularKeyDown;
              common.onPaste = handleCelularPaste;
            }
            if (name === "direccion") {
              common.onKeyDown = handleDireccionKeyDown;
              common.onPaste = handleDireccionPaste;
            }
            return (
              <div key={name}>
                <input
                  {...common}
                  className="w-full border-b border-gray-400 bg-transparent px-1 py-2 focus:outline-none focus:border-green-600 placeholder-gray-500 text-sm"
                />
              </div>
            );
          })}
          <button
            type="submit"
            className="w-full bg-[#5D8A66] text-white py-2 rounded-lg mt-4 hover:bg-[#4b7454] transition"
          >
            Crear cuenta
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-2 text-green-700 hover:underline"
          >
            Ya tengo una cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
