
export default function MultiCheckbox({ label, options, field = "name", values, setValues, className}) {
    function handlerCheck(e) {
        if (!values.includes(e.target.value))
            setValues([...values, e.target.value]);
        else {
            var temp = [];
            values.forEach(element => {
                if (element != e.target.value) temp.push(element);
            });
            setValues(temp);
        }
    }

  

    return (
        <>
            <label className="block 2xl:text-sm text-xs font-medium text-gray-800 2xl:mb-2 sm:mb-1">
                {label}
            </label>
            <div className={`overflow-y-auto sm:max-h-96 max-h-40  ${className}`}>
                <ul className={`pl-2 pb-2 grid  2xl:grid-cols-5 sm:grid-cols-4 grid-cols-1  text-balance 2xl:gap-x-4 2xl:gap-y-6 sm:gap-x-3 sm:gap-y-5 gap-x-2 gap-y-3 text-balance 2xl:text-sm text-xs`}>
                    {options.map((option, idx) =>
                        <li key={option._id ? option._id : option} className="col-span-1">
                            <input
                                type="checkbox"
                                className="focus:ring-blue-500 sm:h-4 sm:w-4 h-3 w-3  text-blue-600 border-gray-300 rounded sm:mr-2 mr-1"
                                value={option._id ? option._id : option}
                                checked={values.includes(option._id ? option._id : option)}
                                onChange={handlerCheck}
                            />
                            {option._id ? option[field] : option}
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}