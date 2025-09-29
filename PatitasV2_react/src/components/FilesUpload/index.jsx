import React, { useContext, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { DocumentIcon, TrashIcon, CloudArrowUpIcon, CloudArrowDownIcon } from '@heroicons/react/20/solid'; // Importa los iconos
import { PlusIcon } from '@heroicons/react/20/solid';
import client from "@/api";
import { StoreContext } from '@/context/store';
import Swal from 'sweetalert2';
import "./FilesUpload.css";

const FilesUpload = forwardRef(({
  label = "", name = "fileInput", files = [], setFiles, maxFiles = 1, accept = "*", maxSize = 5, // 5 MB como valor por defecto
  resize = true, maxSizeImage = 0.5, maxWidth = 1920, maxHeight = 1080, quality = 0.7
}, ref) => {
  const isFileSizeValid = (file) => {
    return file.size <= 1024 * 1024 * maxSize;
  };
  const [localFiles, setLocalFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const store = useContext(StoreContext);

  const isValidFileType = (file) => {
    if (accept === '*') return true;
    return accept.split(',').some(type => file.type.match(type));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { top, right, bottom, left } = event.currentTarget.getBoundingClientRect();
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      setIsDragging(false);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    var validFiles = droppedFiles.filter(isValidFileType);
    const invalidFiles = droppedFiles.filter(file => !isValidFileType(file));
    validFiles = validFiles.filter(isFileSizeValid);
    const oversizedFiles = validFiles.filter(file => !isFileSizeValid(file));
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: 'Archivo(s) demasiado grande(s)',
        text: `Algunos archivos arrastrados exceden el tamaño máximo permitido de ${maxSize}MB.`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'red'
      });
    }
    if (invalidFiles.length > 0) {
      Swal.fire({
        title: 'Archivo(s) no válido(s)',
        text: `Algunos archivos arrastrados no están permitidos.`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'red'
      });
    }

    if (validFiles.length > 0) {
      if (!checkMaxFilesLimit(validFiles)) {
        checkForDuplicateFiles(validFiles);
      }
    }
  };

  const checkForDuplicateFiles = (newFiles) => {
    newFiles.forEach(newFile => {
      if (localFiles.some(file => file.name === newFile.name)) {
        Swal.fire({
          title: 'Archivo duplicado',
          text: `El archivo "${newFile.name}" ya está cargado.`,
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'green'
        });
      }
    });
    const filteredNewFiles = newFiles.filter(newFile =>
      !localFiles.some(file => file.name === newFile.name)
    );

    setLocalFiles([...localFiles, ...filteredNewFiles]);
  };

  const checkMaxFilesLimit = (newFiles) => {
    const totalFiles = newFiles.length + localFiles.length + files.length;
    if (totalFiles > maxFiles) {
      Swal.fire({
        title: 'Límite de archivos excedido',
        text: `Solo se pueden cargar un máximo de ${maxFiles} archivo(s).`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'green'
      });
      return true;
    }
    return false;
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).filter(isFileSizeValid);
    const oversizedFiles = Array.from(event.target.files).filter(file => !isFileSizeValid(file));
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: 'Archivo(s) demasiado grande(s)',
        text: `Algunos archivos arrastrados exceden el tamaño máximo permitido de ${maxSize}MB.`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'red'
      });
    }
    if (!checkMaxFilesLimit(newFiles)) {
      checkForDuplicateFiles(newFiles);
    }
    event.target.value = '';
  };

  const truncateFileName = (name) => {
    return name.length > 8 ? `${name.substring(0, 8)}...` : name;
  };

  const removeFile = (index) => {
    setLocalFiles(localFiles.filter((_, fileIndex) => fileIndex !== index));
  };

  function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        let width = image.width;
        let height = image.height;
        const aspectRatio = width / height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(blob => {
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          } else {
            reject(new Error('Canvas to Blob failed'));
          }
        }, 'image/jpeg', quality);
      };

      image.onerror = error => reject(error);
    });
  }

  async function uploadFilesComponent() {
    for (const file of filesToDelete) {
      await client.delete(`/files/delete/${file._id}`);
    }

    if (localFiles.length === 0) {
      return [];
    }

    const formData = new FormData();

    for (const file of localFiles) {
      if (resize) {
        if (file.type.includes('image/') && (file.size > (maxSizeImage * 1000000) || file.width > maxWidth || file.height > maxHeight)) {
          // Si es una imagen grande, redimensionarla
          try {
            const resizedImage = await resizeImage(file, maxWidth, maxHeight);
            formData.append('files', resizedImage);
          } catch (error) {
            console.error("Error al redimensionar la imagen:", error);
          }
        } else {
          // Si no es necesario redimensionar, añadir tal cual
          formData.append('files', file);
        }
      } else {
        formData.append('files', file);
      }
    }

    try {
      store.setLoading(true);
      const response = await client.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 180000
      });
      setLocalFiles([]);
      return response.data; // Esto debería ser el array de archivos subidos
    } catch (error) {
      console.error("Error al subir archivos:", error);
      return []; // Manejar el error como creas conveniente
    } finally {
      store.setLoading(false);
    }
  }

  const deleteFile = (file) => {
    Swal.fire({
      title: "¿Eliminar Archivo?",
      text: "Este archivo se eliminará definitivamente una vez actualizado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        setFilesToDelete(prev => [...prev, file]);
      }
    });
  };

  const addMoreFiles = () => {
    document.getElementById(name).click();
  };

  useImperativeHandle(ref, () => ({
    uploadFilesComponent,
    localFiles,
  }));

  useEffect(() => {
    setFiles(files.filter(file => !filesToDelete.includes(file)));
  }, [filesToDelete]);

  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('dragend', handleDragEnd);
    return () => {
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  const renderThumbnail = (file, index, isInitial = false) => {
    let borderClass = !isInitial ? "border-inner-dashed" : "";

    if (file.type.startsWith('image/')) {
      let srcImg = isInitial ? file.url : URL.createObjectURL(file);
      return (
        <div key={index} className={`relative ${borderClass} rounded-md shadow-xl`}>
          <img src={srcImg} alt={file.name} className="w-28 h-28 object-cover rounded-md" />
          {renderFileDetails(file, index, isInitial)}
        </div>
      );
    } else {
      return (
        <div key={index} className={`relative ${borderClass} rounded-md shadow-xl`}>
          <DocumentIcon className="w-28 h-28 text-gray-500 rounded-md" />
          {renderFileDetails(file, index, isInitial)}
        </div>
      );
    }
  };

  const renderFileDetails = (file, index, isInitial) => {
    return (
      <>
        <div className="absolute bottom-0 w-full bg-gray-500 bg-opacity-50 text-white text-xs px-1 rounded-b-md">
          {truncateFileName(file.name)}
        </div>
        {isInitial ?
          <>
            <a href={file.url} download target='_blank'
              className="group absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-green-500 bg-opacity-80 rounded-full hover:bg-white">
              <CloudArrowDownIcon className="h-10 w-10 text-white p-2 group-hover:text-green-500" />
            </a>
            <button type="button" className="group absolute top-0 right-0 p-1 flex justify-center items-center bg-red-500 bg-opacity-80 rounded-full hover:bg-white"
              onClick={() => deleteFile(file, index)}>
              <TrashIcon className="h-5 w-5 text-white group-hover:text-red-500" />
            </button>
          </>
          :
          <button type="button" className="group absolute top-0 right-0 p-1 flex justify-center items-center bg-red-500 bg-opacity-80 rounded-full hover:bg-white"
            onClick={() => removeFile(index)}>
            <TrashIcon className="h-5 w-5 text-white group-hover:text-red-500" />
          </button>
        }
      </>
    );
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-800 mb-2">
        {label}
      </label>
      <div className="p-4 border border-gray-300 rounded-lg max-h-80 bg-white shadow-md overflow-y-auto files-upload-container"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
      >
        {isDragging && (
          <div className="overlay">
            <div className="overlay-content flex">
              <CloudArrowUpIcon className="h-12 w-12 text-white mr-4" />
              <p className="overlay-text">Soltar Aquí</p>
            </div>
          </div>
        )}
        <input id={name} name={name} type="file" multiple className="hidden" onChange={handleFileChange} accept={accept} />
        {(localFiles.length > 0 || files.length > 0) ?
          <div className="flex flex-wrap gap-2 p-1">
            {/* Asegúrate de que cada miniatura no se estire */}
            <div className="w-28 h-28 flex-none flex justify-center items-center rounded-md border-2 border-dashed border-green-500 cursor-pointer" onClick={addMoreFiles}>
              <PlusIcon className="h-8 w-8 text-green-500" />
            </div>
            {files.length > 0 && files.map((file, index) => renderThumbnail(file, index, true))}
            {localFiles.length > 0 && localFiles.map((file, index) => renderThumbnail(file, index))}
          </div>
          :
          <div className='flex flex-col items-center justify-center h-full'>
            <DocumentIcon className='h-8 w-8' />
            <p>Arrastra o <strong className='text-blue-800 cursor-pointer' onClick={addMoreFiles}>Selecciona</strong> el archivo</p>
          </div>
        }
      </div>
    </>
  );

});

export default FilesUpload;
