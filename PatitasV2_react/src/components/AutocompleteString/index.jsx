import { useState, useEffect, useRef } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function CustomAutocomplete({ label, options = [], fields = [], value, setValue }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Escucha clics fuera del componente para cerrar el menú
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    const filteredOptions = query ? options.filter(option =>
        fields.some(field => option[field]?.toString().toLowerCase().includes(query.toLowerCase()))
    ) : options;

    const handleSelect = (option) => {
        setValue(fields.map(field => option[field]).join(' - '));
        setIsOpen(false);
        setQuery('');
    };

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setValue(event.target.value);
        setIsOpen(true);
        setSelectedIndex(null);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={inputRef}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative mt-1">
                <input
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                />
                <button
                    type='button'
                    className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
                    onClick={toggleDropdown}
                >
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
                {isOpen && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(option)}
                                    className={classNames(
                                        'cursor-default select-none py-2 pl-8 pr-4',
                                        index === selectedIndex ? 'bg-blue-600 text-white' : 'text-gray-900'
                                    )}
                                >
                                    {fields.map(field => option[field]).join(' - ')}
                                </li>
                            ))
                        ) : (
                            <li className="cursor-default select-none py-2 px-4 text-gray-900">
                                --No existen opciones--
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
