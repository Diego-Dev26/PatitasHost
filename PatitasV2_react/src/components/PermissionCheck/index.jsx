import { StoreContext } from '@/context/store';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Error from '../Error';

function PermissionCheck({ permissions, children }) {
  const store = useContext(StoreContext);

  // 1) Si no hay usuario, lo mandamos al login
  if (!store.user) {
    return <Navigate to="/login" replace />;
  }

  // 2) Si el usuario existe y tiene permisos, renderizamos el contenido protegido
  if (store.checkPermissions(permissions)) {
    return children;
  }

  // 3) Si no tiene permisos, mostramos tu componente de error
  return (
    <Error
      title="Error de Acceso"
      errors={["No tiene los permisos para acceder a esta sección"]}
    />
  );
}

export default PermissionCheck;
