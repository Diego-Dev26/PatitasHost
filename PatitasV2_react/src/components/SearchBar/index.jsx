import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Icon from '@/components/Icon';
import Toggle from '@/components/Toggle';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function SearchBar({ fields = [], search }) {
    const [field, setField] = useState('all');
    const [timer, setTimer] = useState(null);
    const [value, setValue] = useState("");
    const [condition, setCondition] = useState("");

    const options = [
        { id: "all", name: "Todos los Campos", type: "string" },
        ...fields
    ];
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            submit();
        }
    };

    function handleChange(event) {
        const value = event.target.value;
        setValue(value);
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            submit();
        }, 500);
        setTimer(newTimer);
    }

    function submit() {
        if (timer) clearTimeout(timer);
        let valueN = value;
        try {
            valueN = valueN.trim();
        } catch (e) {

        }
        let querySearch = {};
        if (condition)
            querySearch[field] = { value: valueN, value_condition: condition };
        else
            querySearch[field] = valueN;
        search(querySearch);
    }

    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timer]);

    useEffect(() => {
        const type = options.find(x => x.id == field)?.type;
        if (type == "date" || type == "datetime-local" || type == "number") {
            if (!condition) setCondition("equal");
        } else {
            setCondition("");
        }
    }, [field]);

    return (
        <Fragment>
            <div className="flex rounded-md  2xl:text-lg sm:text-sm text-xs font-medium text-black sm:mt-0 mt-4">
                <div className='2xl:mt-1 sm:mt-2 mr-2 '>Buscar por:</div>
                <div className="mb-1 sm:w-60 w-20 sm:text-sm text-xs ">
                    <Listbox value={field} onChange={setField}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="bg-gray-50 relative w-full cursor-default rounded-none rounded-l-md border border-gray-300 py-2 pl-2 2xl:pr-4  pr-5  text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-xs">
                                        <span className="block truncate ">{options.find(x => x.id == field)?.name}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center sm:pr-2 pr-1">
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
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-60 overflow-auto rounded-md bg-white py-1 text-base  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm text-xs">
                                            {options.map((option) => (
                                                <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                        classNames(
                                                            active ? 'sm:text-sm text-xs  text-white bg-blue-600' : 'text-gray-900',
                                                            'relative sm:text-sm text-xs cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={option.id}
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
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4 '
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
                </div>
                <div>
                    {options.find(x => x.id == field)?.type == "string" &&
                        <input
                            type="text"
                            className="bg-white block w-full min-w-0 flex-1 border-gray-300 px-2 py-2  focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs "
                            placeholder="Palabra a buscar"
                            value={value}
                            onKeyDown={handleKeyDown}
                            onChange={e => handleChange(e)}
                        />
                    }
                    {options.find(x => x.id == field)?.type == "number" &&
                        <div className='flex'>
                            <select className="bg-white block w-12 border-gray-300 px-2 py-2  focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs" value={condition} onChange={e => setCondition(e.target.value)}>
                                <option value="equal">=</option>
                                <option value="greater">&gt;</option>
                                <option value="less">&lt;</option>
                                <option value="greaterOrEqual">&ge;</option>
                                <option value="lessOrEqual">&le;</option>
                            </select>
                            <input
                                type="number"
                                className="bg-white block w-full min-w-0 flex-1 border-gray-300 px-2 py-2 focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs"
                                placeholder="Fecha a Buscar"
                                value={value}
                                onKeyDown={handleKeyDown}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                    }
                    {options.find(x => x.id == field)?.type == "date" &&
                        <div className='flex'>
                            <select className="bg-white block w-12 border-gray-300 px-2 py-2  focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs" value={condition} onChange={e => setCondition(e.target.value)}>
                                <option value="equal">=</option>
                                <option value="greater">&gt;</option>
                                <option value="less">&lt;</option>
                                <option value="greaterOrEqual">&ge;</option>
                                <option value="lessOrEqual">&le;</option>
                            </select>
                            <input
                                type="date"
                                className="bg-white block w-full min-w-0 flex-1 border-gray-300 px-2 py-2  focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs"
                                placeholder="Fecha a Buscar"
                                value={value}
                                onKeyDown={handleKeyDown}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                    }
                    {options.find(x => x.id == field)?.type == "time" &&
                        <input
                            type="time"
                            className="bg-white block w-full min-w-0 flex-1 border-gray-300 px-2 py-2  focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs"
                            placeholder="Fecha a Buscar"
                            value={value}
                            onKeyDown={handleKeyDown}
                            onChange={e => handleChange(e)}
                        />
                    }
                    {options.find(x => x.id == field)?.type == "datetime-local" &&
                        <div className='flex'>
                            <select className="bg-white block w-12 border-gray-300 px-2 py-2 focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs" value={condition} onChange={e => setCondition(e.target.value)}>
                                <option value="equal">=</option>
                                <option value="greater">&gt;</option>
                                <option value="less">&lt;</option>
                                <option value="greaterOrEqual">&ge;</option>
                                <option value="lessOrEqual">&le;</option>
                            </select>
                            <input
                                type="datetime-local"
                                className="bg-white block w-full min-w-0 flex-1 border-gray-300 px-2 py-2 focus:border-gray-500 focus:ring-gray-500 sm:text-sm text-xs"
                                placeholder="Fecha a Buscar"
                                value={value}
                                onKeyDown={handleKeyDown}
                                onChange={e => handleChange(e)}
                            />
                        </div>
                    }
                    {options.find(x => x.id == field)?.type == "boolean" &&
                        <Toggle value={value} setValue={setValue} className="w-24 mt-1.5" />
                    }
                </div>
                <div>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-none rounded-r-md border border-transparent bg-green-600 px-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={() => submit()}
                    >
                        <Icon name="MagnifyingGlassIcon" className="mr-1 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </Fragment>
    )
}