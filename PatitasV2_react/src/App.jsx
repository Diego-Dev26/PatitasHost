// src/App.jsx
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./components/Loading";
import Overlay from "./components/Overlay";
import { StoreContext } from "./context/store";

export default function App() {
  const store = useContext(StoreContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let t;
    if (store.loading) {
      setShowOverlay(true);
      t = setTimeout(() => setShowLoading(true), 1000);
    } else {
      clearTimeout(t);
      setShowLoading(false);
      setShowOverlay(false);
    }
    return () => clearTimeout(t);
  }, [store.loading]);

  return (
    <>
      {showOverlay && <Overlay />}
      {showLoading && <Loading />}
      <Outlet />
    </>
  );
}
