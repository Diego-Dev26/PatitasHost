import React, { useState, useEffect, useRef, useContext } from 'react';
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import logo from '@/assets/logo.png';
import client from '@/api';
import { StoreContext } from '@/context/store';
import MultiCheckbox from '@/components/Multicheckbox';
import Select from '@/components/Select1';
import Icon from '@/components/Icon';
import './Group_report.css';
import SearchBar from '@/components/SearchBar';
import { Link } from 'react-router-dom';

function Group_report() {
    const store = useContext(StoreContext);
    const htmlReport = useRef(null);
    const [rangoTiempo, setRangoTiempo] = useState('hoy');
    const [fechaInicio, setFechaInicio] = useState();
    const [fechaFin, setFechaFin] = useState();
    const [camposSeleccionados, setCamposSeleccionados] = useState(['name', 'permissions']);
    const [list, setList] = useState([]);
    const [find, setFind] = useState({});
    const [total, setTotal] = useState(0);
    const populate = ["permissions", "last_user"];

    const optionsRango = [
        { _id: "hoy", name: "Hoy" },
        { _id: "ultimaSemana", name: "Última Semana" },
        { _id: "ultimoMes", name: "Último Mes" },
        { _id: "personalizado", name: "Rango Personalizado" },
    ];

    const campos = [
        { _id: "name", name: "Nombre del Grupo" },
        { _id: "permissions", name: "Permisos" },
        { _id: "last_user", name: "Ultimo Editor" },
        { _id: "createdAt", name: "Fecha de Creación" },
        { _id: "updatedAt", name: "Fecha de Actualización" },
    ];

    function getList(query) {
        store.setLoading(true);
        client.post('/group/list', {
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

    function generarReport(type) {
        if (type == "PDF") {
            //downloadPDF();
            window.print();
        } else if (type == "EXCEL") {
            downloadEXCEL();
        }
    }

    function downloadPDF() {
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'letter'
        });

        var divContents = htmlReport.current.innerHTML;
        doc.html(divContents, {
            callback: function (doc) {
                const fechaActual = new Date();
                const nombreArchivo = `ReporteGrupos_${fechaActual.toLocaleDateString().replace(/\//g, '-')}_${fechaActual.toLocaleTimeString().replace(/:/g, '-')}.pdf`;
                doc.save(nombreArchivo);
            },
            x: 15,
            y: 15,
            autoPaging: 'text',
            width: doc.internal.pageSize.getWidth() - 50,
            windowWidth: 650
        });

        setTimeout(() => {
            store.setLoading(false);
            modal.current?.dismiss();
        }, 1000);
    }

    function downloadEXCEL() {
        var dates = [];
        var headersRow = ['Nro'];
        campos.map(c => {
            if (camposSeleccionados.includes(c._id)) headersRow.push(c.name);
        });
        dates.push(headersRow);
        list.map((i, index) => {
            const r = {};
            try {
                if (camposSeleccionados.includes("name")) r.name = i?.name;
                if (camposSeleccionados.includes("permissions")) r.permissions = i?.permissions?.map(d => d.name).join(", ");
                if (camposSeleccionados.includes("last_user")) r.email = i?.last_user?.name;
                if (camposSeleccionados.includes("last_user")) r.last_user = i?.last_user?.name;
                if (camposSeleccionados.includes("createdAt")) r.createdAt = new Date(i?.createdAt).toLocaleString("es-ES");
                if (camposSeleccionados.includes("updatedAt")) r.updatedAt = new Date(i?.updatedAt).toLocaleString("es-ES");
                const row = [index + 1];
                campos.map(c => {
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
        const nombreArchivo = `ReporteGrupos_${fechaActual.toLocaleDateString().replace(/\//g, '-')}_${fechaActual.toLocaleTimeString().replace(/:/g, '-')}`;
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
            <div className='mt-1 no-print px-4'>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border-gray-200 border sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 uppercase">Reporte de Grupos</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="../group/list"
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
                        >
                            <Icon name="ArrowLeftCircleIcon" className="h-6 w-6" />
                            Atras
                        </Link>
                    </div>
                </div>
                <div className='border rounded-md mt-4 p-2'>
                    <Select label="Rango de Tiempo" options={optionsRango} value={rangoTiempo} setValue={setRangoTiempo} />
                    {rangoTiempo === 'personalizado' && (
                        <div className='flex'>
                            <div className="mt-1 w-1/2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                                    Desde:
                                </label>
                                <input required type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase" />
                            </div>
                            <div className="mt-1 w-1/2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                                    Hasta:
                                </label>
                                <input required type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md uppercase" />
                            </div>
                        </div>
                    )}
                    <hr className='my-2'></hr>
                    <MultiCheckbox label="Columnas Visibles" values={camposSeleccionados} setValues={setCamposSeleccionados} options={campos} />
                </div>
                <div className='flex mt-4'>
                    <div className='mx-4'>
                        <SearchBar
                            fields={[
                                { id: "name", name: "Nombre Completo", type: "string" },
                                { id: "groupname", name: "Nombre de Usuario", type: "string" },
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
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex mx-2 items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <Icon name="PrinterIcon" className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Imprimir
                    </button>
                    <button
                        type="button"
                        onClick={() => generarReport("PDF")}
                        className="inline-flex mx-2 items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                        <Icon name="DocumentIcon" className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Guardar PDF
                    </button>
                    <button
                        type="button"
                        onClick={() => generarReport("EXCEL")}
                        className="inline-flex mx-2 items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        <Icon name="DocumentChartBarIcon" className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                        Descargar EXCEL
                    </button>
                    <div className='justify-end'>

                    </div>
                </div>
                <hr className='my-2'></hr>
                {/* Botones para generar reportes */}
                {/* ... */}
            </div>
            <div>
                <div ref={htmlReport} className="">
                    <img src={logo} alt="Marca de Agua" className="watermark" />
                    <div className="printable-page">
                        <div className="report-header">
                            <img src={logo} alt="Logo" />
                            <h1>Reporte de Grupos</h1>
                            <h2>Fecha: {new Date(Date.now()).toLocaleDateString()}</h2>
                        </div>
                        <div className='before-table'>
                            {rangoTiempo == "personalizado" ?
                                <div className='rango-tiempo'>
                                    <p><strong>Desde:</strong> {new Date(fechaInicio).toLocaleDateString()}</p>
                                    <p style={{ marginLeft: "10px" }}><strong>Hasta:</strong> {new Date(fechaFin).toLocaleDateString()}</p>
                                </div>
                                :
                                <div className='rango-tiempo'>
                                    <p>Registros de <strong>{optionsRango.find(x => x._id == rangoTiempo).name}</strong></p>
                                </div>
                            }
                            <p className='total-registros'>{total} registros</p>
                        </div>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    {campos.map((c, index) =>
                                        camposSeleccionados.includes(c._id) &&
                                        <th key={index}>
                                            {c.name}
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((doc, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {camposSeleccionados.includes("name") && <td>{doc?.name}</td>}
                                        {camposSeleccionados.includes("permissions") && <td>{doc?.permissions?.map(permission => permission?.name).join(", ")}</td>}
                                        {camposSeleccionados.includes("last_user") && <td>{doc?.last_user?.name}</td>}
                                        {camposSeleccionados.includes("createdAt") && <td>{new Date(doc?.createdAt).toLocaleString("es-ES")}</td>}
                                        {camposSeleccionados.includes("updatedAt") && <td>{new Date(doc?.updatedAt).toLocaleString("es-ES")}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Group_report;
