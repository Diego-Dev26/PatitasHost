import React from "react"
import './Error.css'
import { XCircleIcon } from '@heroicons/react/20/solid'

export default function Error({title,errors=[]}) {
    if (!title || !errors.length) {
        return null;
    }
    return (
        <div className="rounded-md bg-red-50 p-2">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="sm:h-5 sm:w-5 h-4 w-4 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="sm:text-sm text-xs font-medium text-red-800">{title}</h3>
                    <div className="sm:mt-2 text-red-700 sm:text-sm text-xs">
                        <ul role="list" className="list-disc space-y-1 pl-5">
                            {errors.map(error => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}