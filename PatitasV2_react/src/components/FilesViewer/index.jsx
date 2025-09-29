import React from 'react';
import { DocumentIcon, CloudArrowDownIcon } from '@heroicons/react/20/solid';
import "./FilesViewer.css";

const FilesViewer = ({ files = [], extraClass = "" }) => {

    const truncateFileName = (name) => {
        return name.length > 8 ? `${name.substring(0, 8)}...` : name;
    };

    const renderThumbnail = (file, index) => {
        if (file.type.startsWith('image/')) {
            return (
                <div key={index} className="relative rounded-md shadow-xl">
                    <img src={file.url} alt={file.name} className="w-28 h-28 object-cover rounded-md" />
                    {renderFileDetails(file, index)}
                </div>
            );
        } else {
            return (
                <div key={index} className="relative rounded-md shadow-xl">
                    <DocumentIcon className="w-28 h-28 text-gray-500 rounded-md" />
                    {renderFileDetails(file, index)}
                </div>
            );
        }
    };

    const renderFileDetails = (file, index) => {
        return (
            <>
                <div className="absolute bottom-0 w-full bg-gray-500 bg-opacity-50 text-white text-xs px-1 rounded-b-md">
                    {truncateFileName(file.name)}
                </div>
                <a href={file.url} download target='_blank'
                    className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-green-500 bg-opacity-80 rounded-full hover:bg-white">
                    <CloudArrowDownIcon className="h-10 w-10 text-white p-2 group-hover:text-green-500" />
                </a>
            </>
        );
    };

    return (
        <div className={"p-1 border border-gray-300 rounded-lg bg-white shadow-md overflow-y-auto files-upload-container max-h-80 " + extraClass}>

            {files.length > 0 ?
                <div className="flex flex-wrap gap-2">
                    {files.map((file, index) => renderThumbnail(file, index))}
                </div>
                :
                <div className='flex flex-col items-center justify-center'>
                    <DocumentIcon className='h-8 w-8' />
                    <p>Sin Archivos</p>
                </div>
            }

        </div>
    );
};

export default FilesViewer;
