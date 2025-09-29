import React, { useState, useEffect, useRef, useContext } from 'react';
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import logo from '@/assets/logo.png';
import client from '@/api';
import { StoreContext } from '@/context/store';
import MultiCheckbox from '@/components/Multicheckbox';
import Select from '@/components/Select1';
import Icon from '@/components/Icon';
import './User_report.css';
import SearchBar from '@/components/SearchBar';
import { Link } from 'react-router-dom';

function User_report() {
    const store = useContext(StoreContext);
    const htmlReport = useRef(null);
    const [rangoTiempo, setRangoTiempo] = useState('hoy');
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [camposSeleccionados, setCamposSeleccionados] = useState(['name', 'username', 'is_active']);
    const [list, setList] = useState([]);

    const [find, setFind] = useState({});
    const [total, setTotal] = useState(0);
    const populate = ["groups", "permissions", "last_user"];

    const optionsRango = [
        { _id: "hoy", name: "Hoy" },
        { _id: "ultimaSemana", name: "Última Semana" },
        { _id: "ultimoMes", name: "Último Mes" },
        { _id: "personalizado", name: "Rango Personalizado" },
    ];

    const campos = [
        { _id: "name", name: "Nombre Completo" },
        { _id: "username", name: "Nombre de Usuario" },
        { _id: "email", name: "Correo Electrónico" },
        { _id: "is_active", name: "Activo" },
        { _id: "is_admin", name: "Administrador" },
        { _id: "groups", name: "Grupos" },
        { _id: "permissions", name: "Permisos Individuales" },
        { _id: "last_user", name: "Ultimo Editor" },
        { _id: "createdAt", name: "Fecha de Creación" },
        { _id: "updatedAt", name: "Fecha de Actualización" },
        { _id: "name", name: "Nombre Completo" },
        { _id: "username", name: "Nombre de Usuario" },
        { _id: "email", name: "Correo Electrónico" },
        { _id: "is_active", name: "Activo" },
        { _id: "is_admin", name: "Administrador" },
        { _id: "groups", name: "Grupos" },
        { _id: "permissions", name: "Permisos Individuales" },
        { _id: "last_user", name: "Ultimo Editor" },
        { _id: "createdAt", name: "Fecha de Creación" },
        { _id: "updatedAt", name: "Fecha de Actualización" },
    ];

    function getList(query) {
        store.setLoading(true);
        client.post('/user/list', {
            query: {
                ...query,
                populate
            }
        }).then(r => {
            setList(r.data.list);
            setTotal(r.data.count);
        }).finally(() => {
            store.setLoading(false);
        });
    }
    function calcularRangoFechas() {
        let fechaI, fechaF;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Establecer a medianoche

        switch (rangoTiempo) {
            case 'hoy':
                fechaI = new Date(hoy);
                fechaF = new Date(hoy);
                break;
            case 'ultimaSemana':
                fechaI = new Date(hoy);
                fechaI.setDate(hoy.getDate() - 7);
                fechaF = new Date(hoy);
                break;
            case 'ultimoMes':
                fechaI = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
                fechaF = new Date(hoy);
                break;
            case 'personalizado':
                fechaI = new Date(fechaInicio);
                fechaF = new Date(fechaFin);
                break;
            default:
                // Manejar caso por defecto o error
                break;
        }

        fechaF.setHours(23, 59, 59, 999);
        return { fechaI, fechaF };
    }
    function imprimirTabla() {
        // Extrae el contenido solo de la tabla y del encabezado
        const contenidoTabla = document.querySelector('.printable-page table')?.outerHTML;

        if (!contenidoTabla) {
            console.error("Error: No se encontró la tabla.");
            return;
        }

        const encabezado = `
            <div style="display: flex; align-items: center; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #ccc; padding: 10px 0; margin-bottom: 20px;">
                <div style="flex: 1; text-align: left;">
                    <img src="${logo}" alt="Logo" style="width: 100px;" />
                </div>
                <div style="flex: 2; text-align: center; font-size: 1.5em;">
                    Reporte Usuarios
                </div>
                <div style="flex: 1; text-align: right; font-size: 1em;">
                    Fecha: ${new Date(Date.now()).toLocaleDateString()}
                </div>
            </div>`;

        const ventanaImpresion = window.open('', '_blank');

        // Asegurarse de que el contenido esté limpio antes de escribir
        ventanaImpresion.document.open();
        ventanaImpresion.document.write(`
            <html>
                <head>
                    
                    <style>
                        @media print {
                            @page {
                                size: landscape;
                                margin: 1cm;
                            }
                        }
                        body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
                        .printable-page { width: 100%; text-align: center; }
                        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; font-size: 12px; word-wrap: break-word; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    <div class="printable-page">
                        ${encabezado}
                        ${contenidoTabla}
                    </div>
                </body>
            </html>
        `);
        ventanaImpresion.document.close();
    }


    function downloadPDF() {
        // Extrae el contenido solo de la tabla y del encabezado
        const contenidoTabla = document.querySelector('.printable-page table')?.outerHTML;

        if (!contenidoTabla) {
            console.error("Error: No se encontró la tabla.");
            return;
        }

        const encabezado = `
            <div style="display: flex; align-items: center; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #ccc; padding: 10px 0; margin-bottom: 20px;">
                <div style="flex: 1; text-align: left;">
                    <img src="${logo}" alt="Logo" style="width: 100px;" />
                </div>
                <div style="flex: 2; text-align: center; font-size: 1.5em;">
                    Reporte Usuarios
                </div>
                <div style="flex: 1; text-align: right; font-size: 1em;">
                    Fecha: ${new Date(Date.now()).toLocaleDateString()}
                </div>
            </div>`;

        const contenidoHTML = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
                        .printable-page { width: 100%; text-align: center; }
                        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; font-size: 10px; word-wrap: break-word; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="printable-page">
                        ${encabezado}
                        ${contenidoTabla}
                    </div>
                </body>
            </html>`;

        // Crear instancia de jsPDF
        const doc = new jsPDF({
            orientation: 'landscape', // Orientación horizontal
            unit: 'pt', // Unidad en puntos
            format: 'letter' // Formato carta
        });

        // Renderizar contenido HTML en el PDF
        doc.html(contenidoHTML, {
            callback: function (doc) {
                const fechaActual = new Date();
                const nombreArchivo = `ReporteUsuarios_${fechaActual.toISOString().split('T')[0]}.pdf`;
                doc.save(nombreArchivo); // Guardar el archivo PDF
            },

        });
    }









    function downloadEXCEL() {
        var dates = [];
        var headersRow = ['Nro'];
        campos.forEach(c => {
            if (camposSeleccionados.includes(c._id)) headersRow.push(c.name);
        });
        dates.push(headersRow);
        list.forEach((i, index) => {
            const r = {};
            try {
                if (camposSeleccionados.includes("name")) r.name = i?.name;
                if (camposSeleccionados.includes("username")) r.username = i?.username;
                if (camposSeleccionados.includes("email")) r.email = i?.email;
                if (camposSeleccionados.includes("is_admin")) r.is_admin = i?.is_admin ? "SI" : "NO";
                if (camposSeleccionados.includes("is_active")) r.is_active = i?.is_active ? "SI" : "NO";
                if (camposSeleccionados.includes("groups")) r.groups = i?.groups?.map(d => d.name).join(", ");
                if (camposSeleccionados.includes("permissions")) r.permissions = i?.permissions?.map(d => d.name).join(", ");
                if (camposSeleccionados.includes("last_user")) r.last_user = i?.last_user?.name;
                if (camposSeleccionados.includes("createdAt")) r.createdAt = new Date(i?.createdAt).toLocaleString("es-ES");
                if (camposSeleccionados.includes("updatedAt")) r.updatedAt = new Date(i?.updatedAt).toLocaleString("es-ES");
                const row = [index + 1];
                campos.forEach(c => {
                    if (camposSeleccionados.includes(c._id)) row.push(r[c._id]);
                });
                dates.push(row);
            } catch (e) {
                console.log(e);
            }
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(dates);
        XLSX.utils.book_append_sheet(workbook, worksheet, " Datos");
        const fechaActual = new Date();
        const nombreArchivo = `ReporteUsuarios_${fechaActual.toLocaleDateString().replace(/\//g, '-')}_${fechaActual.toLocaleTimeString().replace(/:/g, '-')}`;
        XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
        setTimeout(() => {
            store.setLoading(false);
        }, 1000);
    }

    function search(obj) {
        var rangoF = calcularRangoFechas();
        setFind(obj);
        getList({
            search: obj,
            find: {
                createdAt: {
                    $gte: rangoF.fechaI,
                    $lte: rangoF.fechaF
                }
            },
            count: true
        });
    }

    useEffect(() => {
        var rangoF = calcularRangoFechas();
        getList({
            search: find,
            find: {
                createdAt: {
                    $gte: rangoF.fechaI,
                    $lte: rangoF.fechaF
                }
            },
            count: true
        });
    }, [rangoTiempo, fechaInicio, fechaFin]);

    return (
        <div>
            <div className="px-2 py-1 sm:py-2 xl:py-4">
                <div className="bg-gray-50 px-1  py-0.5 sm:py-0.5 2xl:py-1  sm:flex flex flex-wrap-reverse sm:items-center w-full">

                    <div className="sm:flex-auto">
                        <h1 className="text-balance 2xl:text-xl sm:text-lg text-sm  mt-2 sm:mt-0 font-semibold text-gray-900 uppercase">Reporte de Usuarios</h1>
                    </div>
                    <div className=" mt-0 sm:ml-16 ml-4 sm:flex-none">
                        <Link
                            to="../user/list"
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <Icon name="ArrowLeftCircleIcon" className="2xl:h-6 2xl:w-6 sm:mr-4 mr-1 sm:h-5 sm:w-5 h-4 w-4" />
                            Atras
                        </Link>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between sm:gap-x-6 gap-x-2 sm:gap-y-4 sm:py-2 sm:flex-nowra">
                    <div className="flex items-center">
                        <Select label="Rango de Tiempo" className=" ml-2" options={optionsRango} value={rangoTiempo} setValue={setRangoTiempo} />
                    </div>
                    <div className="shadow-sm sm:px-4 sm:text-sm text-xs mt-4 sm:mt-0">
                        {rangoTiempo === 'personalizado' && (
                            <div className='flex gap-x-2'>
                                <div className="w-1/2">
                                    <label htmlFor="name" className="block sm:text-sm text-xs font-medium text-gray-800">
                                        Desde:
                                    </label>
                                    <input required type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className=" sm:text-sm text-xs focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm border-gray-300 rounded-md " />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="name" className="block sm:text-sm text-xs font-medium text-gray-800">
                                        Hasta:
                                    </label>
                                    <input required type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className=" sm:text-sm  text-xs focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm  border-gray-300 rounded-md " />
                                </div>
                            </div>)}
                    </div>
                </div>
                <hr className='my-2'></hr>
                <MultiCheckbox label="Columnas Visibles" values={camposSeleccionados} setValues={setCamposSeleccionados} options={campos} />
                <div className="mt-2 sm:mt-0 flex flex-wrap items-center justify-between sm:gap-x-6 sm:gap-y-4 sm:py-2 sm:flex-nowra ">
                    <div className="flex items-center ">
                        <SearchBar
                            fields={[
                                { id: "name", name: "Nombre Completo", type: "string" },
                                { id: "username", name: "Nombre de Usuario", type: "string" },
                                { id: "groups", name: "Grupos", type: "string" },
                                { id: "permissions", name: "Permisos", type: "string" },
                                { id: "is_admin", name: "Administrador", type: "boolean" },
                                { id: "is_active", name: "Activo", type: "boolean" },
                                { id: "last_login", name: "Ultimo Inicio de Sesión", type: "date" },
                                { id: "createdAt", name: "Creado en", type: "datetime-local" },
                                { id: "updatedAt", name: "Actualizado en", type: "datetime-local" },
                            ]}
                            search={(e) => search(e)}
                        />
                    </div>

                    <div className="shadow-sm sm:px-2 px-4 ">
                        <div className='justify-end'>
                            <button
                                type="button"
                                onClick={imprimirTabla}
                                className="inline-flex mx-2 mt-2 sm:mt-0items-center sm:gap-x-1.5 gap-x- rounded-md bg-blue-600 px-3 py-2  sm:text-sm text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                <Icon name="PrinterIcon" className="-ml-0.5 sm:h-5 sm:w-5 h-4 w-4 " aria-hidden="true" />
                                Imprimir
                            </button>
                            {/* Botones para generar reportes      <button
                        type="button"
                        onClick={downloadPDF}
                        className="inline-flex mx-2 mt-2 sm:mt-0 items-center sm:gap-x-1.5 gap-x-1  rounded-md bg-orange-600 px-3  py-2  sm:text-sm text-xs font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                        <Icon name="DocumentIcon" className="-ml-0.5 sm:h-5 sm:w-5  h-4 w-4" aria-hidden="true" />
                        Guardar PDF
                    </button> */}


                            <button
                                type="button"
                                onClick={downloadEXCEL}
                                className="inline-flex mx-2 mt-2 sm:mt-0 items-center sm:gap-x-1.5 gap-x-1  rounded-md bg-green-600 px-3  py-2 sm:text-sm text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                            >
                                <Icon name="DocumentChartBarIcon" className="-ml-0.5 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                                Descargar EXCEL
                            </button>
                        </div>
                    </div>
                </div>


            </div>


            <div>
                <div className=" mt-2">

                    <div ref={htmlReport} className="printable-page">
                        <div className="report-header">

                            <div scope="colgroup" className=" flex relative isolate  font-semibold  border-b border-gray-200 bg-gray-50">
                                <img className="flex-none" src={logo} alt="Logo" />
                                <label className='grow   text-xs sm:text-sm 2xl:text-lg py-4 uppercase'>Reportes Usuarios </label>
                                <label className='text-xs  2xl:text-md mt-8'>Fecha: {new Date(Date.now()).toLocaleDateString()}</label>

                            </div>


                        </div>
                        <img src={logo} alt="Marca de Agua" className="watermark" />
                        <div className='before-table'>
                            {rangoTiempo == "personalizado" ?
                                <div className='rango-tiempo'>
                                    <p><strong>Desde:</strong> {new Date(fechaInicio).toLocaleDateString()}</p>
                                    <p style={{ marginLeft: "10px" }}><strong>Hasta:</strong> {new Date(fechaFin).toLocaleDateString()}</p>
                                </div>
                                :
                                <div className='rango-tiempo sm:text-sm text-xs'>
                                    <p>Registros de: <strong>{optionsRango.find(x => x._id == rangoTiempo).name}</strong></p>
                                </div>
                            }
                            <p className='total-registros sm:text-sm text-xs'><strong>{total}</strong>: Cantidad de Registros</p>
                        </div>


                        {/*vista previa de reporte */}

                        <div className="visible sm:invisible  justify-between gap-x-8 gap-y-4 bg-white p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center ">
                            <p className="max-w-4xl  text-sm/6 text-gray-900">

                                "Los datos son muy amplios para visualizarse aquí. Usa una pantalla más grande o descarga el reporte con los botones de arriba."
                            </p>

                        </div>
                        <div ref={htmlReport} className="invisible sm:visible sm:-mt-10 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg w-full max-w-screen  ">
                            <table className=" table-fixed divide-y-2 divide-gray-300 min-w-full align-middle">
                                <thead className="bg-gray-50  ">

                                    <th scope="col" className="w-1/12 py-3.5 pl-4 pr-1 sm:pr-2 2xl:pr-3 text-left 2xl:text-sm text-xs font-semibold text-gray-900 sm:pl-6">
                                        Nro
                                    </th>
                                    {campos.map((c, index) =>
                                        camposSeleccionados.includes(c._id) &&
                                        <th className='py-1  pr-1 sm:pr-2 2xl:pr-3 text-left 2xl:text-sm text-xs font-semibold text-gray-900 ' key={index}>
                                            {c.name}
                                        </th>
                                    )}


                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white 2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 text-left ">
                                    {list.map((doc, index) => (
                                        <tr className='even:bg-gray-50' key={index}>

                                            <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-lg  text-xs text-gray-500">{index + 1}</td>
                                            {camposSeleccionados.includes("name") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.name}</td>}
                                            {camposSeleccionados.includes("username") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.username}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}
                                            {camposSeleccionados.includes("email") && <td className="2xl:px-3 sm:px-2 px-1 2xl:py-4 sm:py-2 py-1 2xl:text-sm text-xs text-gray-500">{doc?.email}</td>}

                                            {camposSeleccionados.includes("is_active") && <td className={doc?.is_active ? "boolean-true" : "boolean-false"}>{doc?.is_active ? "SI" : "NO"}</td>}
                                        </tr>
                                    ))}


                                </tbody>
                            </table>


                        </div>


                    </div>
                </div>
            </div>
        </div >
    );
}

export default User_report;
