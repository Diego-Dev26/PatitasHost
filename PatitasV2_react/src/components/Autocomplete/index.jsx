import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Autocomplete({
  label,
  options = [],
  fields = ["name"],
  value,
  setValue,
  className = "bg-white",
}) {
  const [query, setQuery] = useState("");

  const filteredOptions = query
    ? options.filter((option) => {
        return fields.some((field) => {
          const fieldValue = option[field]
            ? option[field].toString().toLowerCase()
            : "";
          return fieldValue.includes(query.toLowerCase());
        });
      })
    : options;

  const displayValue = (val) => {
    try {
      if (options.length === 0) return "--No existen opciones--";
      if (!val) return "";
      const foundOption = options.find((option) =>
        option._id ? option._id === val : option === val
      );
      if (foundOption) {
        return fields.map((field) => foundOption[field]).join(" - ");
      }
    } catch {
      return "-------";
    }
    return "---------";
  };

  return (
    <Combobox as="div" value={value} onChange={setValue}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {label}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className={
            "w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm " +
            className
          }
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => displayValue(value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>
        {filteredOptions.length > 0 ? (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={option._id || option}
                value={option._id ? option._id : option}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {fields.map((field) => option[field]).join(" - ")}
                    </span>
                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-blue-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        ) : (
          <Combobox.Options className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div className="relative cursor-default select-none py-2 px-4 text-gray-900">
              --No existen opciones--
            </div>
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
