import React, { useEffect, useState } from "react";
import * as SolidIcons from '@heroicons/react/20/solid';
import Icon from '@/components/Icon';
import "./SelectIcon2.css";

function Modal ({ open, setOpen, setValue }) {
  const [icons,set_icons]=useState([]);
  useEffect(()=> {
      set_icons(Object.keys(SolidIcons));
  },[]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      //document.body.classList.add("fixed-top-left");
    } else {
      document.body.classList.remove("no-scroll");
      //document.body.classList.add("fixed-top-left");
    }
  }, [open]);

  return (
    <div className="">
      {/* Fondo oscuro para el modal */}
      {open && (
        <div
          className="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity h-full w-full"
        ></div>
      )}

      {/* Contenedor del modal */}
      {open && (
        <div className="fixed z-50 inset-0 overflow-y-auto w-full" onClick={()=>setOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg w-1/2 p-6">
              <div className="text-base text-center font-semibold leading-6 text-gray-900">Seleccione el Icono (Heroicons)</div>
              <div className="mt-2">
                  {icons.map((icon)=>
                      <button
                          key={icon}
                          type="button"
                          className="rounded-full bg-blue-600 p-1 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          onClick={() => {
                              setValue(icon);
                              setOpen(false);
                          }}
                      >
                          <Icon name={icon} className="h-5 w-5" aria-hidden="true" />
                      </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
