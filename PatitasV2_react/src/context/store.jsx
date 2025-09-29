import { createContext, useReducer } from "react";
import Swal from "sweetalert2";
import client from "@/api";

const initialState = {
  user: null,
  loading: false,
  query: null,
};

// carga user inicial si está persistido
try {
  if (localStorage.getItem("user")) {
    initialState.user = JSON.parse(localStorage.getItem("user"));
  }
} catch {}

function makeHeaven(length) {
  let result = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678";
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

function storeReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "SET_QUERY":
      return { ...state, query: action.payload };
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export const StoreContext = createContext({
  user: null,
  loading: false,
  login(userData) {},
  logout() {},
  updateProfile(data) {},
  setLoading(value) {},
  refreshToken(value) {},
  setQuery(value) {},
  checkPermissions(permissions) {},
  checkPermissionsMenu(permissions) {},
  showErrors(errors) {},
  showSuccess(values) {},
});

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  function persistSession({ token, user }) {
    // guarda token crudo (sin Bearer) bajo "heaven" — el axios interceptor lo usa
    if (token) {
      localStorage.setItem("heaven", token);
      localStorage.setItem("token", makeHeaven(token.length));     // decorativo
      localStorage.setItem("sesionId", makeHeaven(token.length));  // decorativo
      const next = Date.now() + Number((import.meta.env.VITE_JWT_TIME || 9)) * 60 * 1000;
      localStorage.setItem("nextRefresh", String(next));
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: user });
    }
  }

  // Espera payload con { user, token } o { user, accessToken }
  function login(payload) {
    const token = payload?.token || payload?.accessToken; // soporta ambos
    const user = payload?.user;

    if (!token || !user) {
      showErrors(["Respuesta de login inválida (falta token o user)."]);
      dispatch({ type: "LOADING", payload: false });
      return;
    }

    persistSession({ token, user });
    dispatch({ type: "LOADING", payload: false });
  }

  function refreshToken(payload) {
    const token = payload?.token || payload?.accessToken;
    const user = payload?.user; // si lo manda, lo actualizamos

    if (token) {
      localStorage.setItem("heaven", token);
      localStorage.setItem("token", makeHeaven(token.length));
      localStorage.setItem("sesionId", makeHeaven(token.length));
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "LOGIN", payload: user });
    }
  }

  function logout() {
    try {
      client.get("/user/logout").catch(() => {});
    } catch {}
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
  }

  function updateProfile(data) {
    try {
      const tmp = JSON.parse(localStorage.getItem("user") || "{}");
      const merged = { ...tmp, ...data };
      localStorage.setItem("user", JSON.stringify(merged));
      dispatch({ type: "UPDATE_PROFILE", payload: data });
    } catch {
      // ignora
    }
  }

  function setLoading(value) {
    dispatch({ type: "LOADING", payload: value });
  }

  function setQuery(value) {
    dispatch({ type: "SET_QUERY", payload: value });
  }

  function checkPermissions(perms) {
    if (!state.user) return false;
    if (state.user.is_admin) return true;
    const all = state.user.all_permissions || [];
    return perms.every((p) => all.includes(p));
  }

  function checkPermissionsMenu(permissions) {
    if (!state.user) return false;
    if (state.user.is_admin) return true;
    const all = state.user.all_permissions || [];
    return permissions.some(([permKey]) => all.includes(permKey));
  }

  function showSuccess({ title = "Éxito!", message, redirect, navigate }) {
    Swal.fire({
      title,
      text: message,
      icon: "success",
      confirmButtonColor: "green",
      allowOutsideClick: false,
    }).then((r) => {
      if (r.isConfirmed && redirect) navigate(redirect);
    });
  }

  function showErrors(errors) {
    const html = (errors || []).join("<br>");
    Swal.fire({ title: "Error!", html, icon: "error", confirmButtonColor: "red" });
  }

  return (
    <StoreContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        logout,
        updateProfile,
        setLoading,
        refreshToken,
        setQuery,
        checkPermissions,
        checkPermissionsMenu,
        showSuccess,
        showErrors,
      }}
      {...props}
    />
  );
}
