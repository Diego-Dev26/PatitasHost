import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function EntriesSelect({ options = [], field = "name", value, setValue, className }) {
    // Función para determinar si una opción es un objeto o un string
    return (
        <Listbox value={value} onChange={setValue}>
            {({ open }) => (
                <>
                    <div className="relative">
                        <Listbox.Button className="bg-gray-50 relative w-full cursor-default rounded-md border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                            <span className="block truncate">{options.find(x => x._id == value)?.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option._id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'text-white bg-blue-600' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={option._id}
                                    >
                                        {({ value, active }) => (
                                            <>
                                                <span className={classNames(value ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                    {option.name}
                                                </span>

                                                {value ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-blue-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
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
                    </div>
                </>
            )}
        </Listbox>
    );
}
