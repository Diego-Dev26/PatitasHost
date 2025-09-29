import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import * as SolidIcons from '@heroicons/react/20/solid';

export default function SelectIcon({open,setOpen,setValue}) {
    const [icons,set_icons]=useState([]);
    useEffect(()=> {
        set_icons(Object.keys(SolidIcons));
    },[]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Seleccione el Icono (Heroicons)
                    </Dialog.Title>
                    <div className="mt-2">
                        {Object.keys(SolidIcons).map((icon)=>{
                          const Icon=SolidIcons[icon];
                          return (
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
                          )
                        })}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
