import { createContext, useReducer } from "react";
import Swal from 'sweetalert2';
import client from '@/api';

const initialState = {
    user: null,
    loading: false,
    query: null,
}

if (localStorage.getItem('token') && localStorage.getItem("user")) {
    initialState.user = JSON.parse(localStorage.getItem("user"));
}

function makeHeaven(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function storeReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        case 'LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_QUERY':
            return {
                ...state,
                query: action.payload
            }
        case 'UPDATE_PROFILE':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            }
        default:
            return state
    }
}

export const StoreContext = createContext({
    user: null,
    loading: false,
    login(userData) { },
    logout() { },
    updateProfile(data) { },
    setLoading(value) { },
    refreshToken(value) { },
    setQuery(value) { },
    checkPermissions(permissions) { },
    checkPermissionsMenu(permissions) { },
    showErrors(errors) { },
    showSuccess(values) { },
});

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(storeReducer, initialState);
    function login(data) {
        localStorage.setItem("heaven", data.token);
        localStorage.setItem("token", makeHeaven(data.token.length));
        localStorage.setItem("sesionId", makeHeaven(data.token.length));
        localStorage.setItem("user", JSON.stringify(data.user));

        var next = Date.now() + (parseInt(import.meta.env.VITE_JWT_TIME) * 60 * 1000);
        localStorage.setItem("nextRefresh", next)

        dispatch({
            type: 'LOGIN',
            payload: data.user
        })
    }
    function logout() {
        localStorage.clear();
        client.get("/user/logout");
        dispatch({
            type: 'LOGOUT'
        });
    }
    function updateProfile(data) {
        var tempUser = JSON.parse(localStorage.getItem("user"));
        console.log(tempUser);
        tempUser = {
            ...tempUser,
            ...data
        }
        console.log(tempUser);
        localStorage.setItem("user", JSON.stringify(tempUser));
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: data
        })
    }
    function setLoading(value) {
        dispatch({
            type: 'LOADING',
            payload: value
        });
    }
    function setQuery(value) {
        dispatch({
            type: 'SET_QUERY',
            payload: value
        });
    }
    function checkPermissions(permissions) {
        // Si no hay usuario logueado, no hay permisos
        if (!state.user) return false;

        // Si es admin, tiene siempre todos los permisos
        if (state.user.is_admin) return true;

        // Sino, chequear permisos específicos
        for (let perm of permissions) {
            if (!state.user.all_permissions.includes(perm)) {
                return false;
            }
        }
        return true;
    }

    function checkPermissionsMenu(permissions) {
        // Si no hay usuario, no mostramos ninguna opción de menú
        if (!state.user) return false;

        // Admin ve todo
        if (state.user.is_admin) return true;

        // Sino, al menos uno de los permisos para el menú
        return permissions.some(([permKey]) =>
            state.user.all_permissions.includes(permKey)
        );
    }
    function refreshToken(data) {
        localStorage.setItem("heaven", data.token);
        localStorage.setItem("token", makeHeaven(data.token.length));
        localStorage.setItem("sesionId", makeHeaven(data.token.length));
    }
    function showSuccess({ title = "Éxito!", message, redirect, navigate }) {
        Swal.fire({
            title,
            text: message,
            icon: 'success',
            confirmButtonColor: "green",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed && redirect) {
                navigate(redirect);
            }
        });
    }

    function showErrors(errors) {
        const errorMessage = errors.join("<br>");
        Swal.fire({
            title: 'Error!',
            html: errorMessage,
            icon: 'error',
            confirmButtonColor: "red",
        })
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
    )
}