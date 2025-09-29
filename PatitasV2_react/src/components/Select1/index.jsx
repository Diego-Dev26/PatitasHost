import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Select({ label, options = [], field = "name", value, setValue, className }) {
  // Función para determinar si una opción es un objeto o un string
  const isObjectOption = (option) => option && typeof option === 'object' && option._id;

  const renderOptionText = (option) => isObjectOption(option) ? option[field] : option;

  return (
    <Listbox value={value} onChange={setValue}>
      {({ open }) => (
        <>
          <Listbox.Label className="block font-medium text-black 2xl:text-sm text-xs">{label}</Listbox.Label>
          <div className="relative">
            <Listbox.Button className={"relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-xs " + className}>
              <span className="block truncate">
                {options.length === 0 ? "--No existen opciones--" : (value ? renderOptionText(options.find(option => isObjectOption(option) ? option._id === value : option === value)) : "--Seleccionar--")}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            {options.length > 0 && (
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none 2xl:text-sm text-xs">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={isObjectOption(option) ? option._id : index}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={isObjectOption(option) ? option._id : option}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                            {renderOptionText(option)}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-5'
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            )}
          </div>
        </>
      )}
    </Listbox>
  );
}