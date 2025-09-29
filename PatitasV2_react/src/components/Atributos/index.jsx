import Select from "@/components/Select1";
import Autocomplete from '@/components/Autocomplete';
import { useEffect, useState } from "react";
import Toogle from "../Toggle";
import Popover from "@/components/Popover";
import CopyForeign from "@/assets/copyForeign.png";
import display from '@/assets/display.png'
import SelectIcon from "../SelectIcon";
import Icon from "../Icon";

export default function Atributos({campo,setCampo,tables,campos}) {
    
    const [showIcon,set_ShowIcon]=useState(false);
    const [options,set_options]=useState(false);

    useEffect(()=>{
        if(!campo?.ref)
            setCampo({...campo,field:null})
    },[campo?.ref])

    useEffect(()=>{
        console.log(campo);
    },[campo])

    return (
        <>
            <div className="absolute z-50 w-full">
                <SelectIcon open={showIcon} setOpen={set_ShowIcon} setValue={(e)=>setCampo({...campo,icon:e})} />
            </div>
            <div className="w-full">
                <Select 
                    label="Tipo de Campo"
                    options={[
                        {id:"ObjectId",name:"Foraneo"},
                        {id:"String",name:"String"},
                        {id:"Number",name:"Number"},
                        {id:"Date",name:"Date"},
                        {id:"Date",name:"Date (Fecha y Hora)"},
                        {id:"Time",name:"Time (solo Hora)"},
                        {id:"Boolean",name:"Boolean"},
                        {id:"Mixed",name:"Mixed"},
                    ]}
                    field="name"
                    value={campo.type}
                    setValue={(e)=>{
                        setCampo({
                            id:campo.id,
                            nombre:campo.nombre,
                            table:campo.table,
                            type:e
                        });
                    }}
                />
                <div className="mt-2">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                        Texto Superior del Campo
                        <Popover title="Display" content="El texto que se mostrara en los formularios, tablas, detalle, etc, del campo." image={display} />
                    </label>
                    <div className="mt-2">
                        <input type="text" name="display" id="display" value={campo.display} onChange={(e)=>setCampo({...campo,display:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="mt-2">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                        PlaceHolder
                        <Popover title="PlaceHolder" content="Se define como un consejo o indicación corta que puede consistir en una solo palabra o en una pequeña frase. SE APLICARA SOLO SI EL CAMPO ES COMPATIBLE." />
                    </label>
                    <div className="mt-2">
                        <input type="text" placeholder="Ejemplo: PlaceHolder" name="placeholder" id="placeholder" value={campo.placeholder} onChange={(e)=>setCampo({...campo,placeholder:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="mt-2">
                    <Toogle label="Campo Obligatorio" value={campo.required} setValue={(e)=>setCampo({...campo,required:e})} />
                </div>
                <div className="mt-2 flex">
                    <Toogle label="Mostrar en la Tabla" value={campo.tableShow} setValue={(e)=>setCampo({...campo,tableShow:e})} />
                    <Popover title="Tabla" content="Se incluira en las listas, se creara una columna en la tabla" />
                </div>
                <div className="mt-2 flex">
                    <Toogle label="Solo Lectura" value={campo.readOnly} setValue={(e)=>setCampo({...campo,readOnly:e})} />
                    <Popover title="READONLY" content="El campo no se podra editar por el usuario, pero si se puede ingresar valores desde el backend con personalización." />
                </div>
                {campo.type=="ObjectId" &&
                    <>
                        <div>
                            <Autocomplete label="Tabla de Referencia" options={tables.map(t=>t.nombre)} value={campo.ref} setValue={(e)=>setCampo({...campo,ref:e})} />
                        </div>
                        <div>
                            <Autocomplete label="Campo de la Tabla de Referencia" options={campos.filter(x=>x.table==tables.find(t=>t.nombre==campo.ref)?.id).map(c=>c.nombre)} value={campo.field} setValue={(e)=>setCampo({...campo,field:e})} />
                        </div>
                        {!campo.array && <Select
                            label="Estilo de Entrada"
                            options={[
                                {id:"Select",name:"Select"},
                                {id:"Combobox",name:"Combobox (Autocomplete)"}
                            ]}
                            field="name"
                            value={campo.estilo}
                            setValue={(e)=>{setCampo({...campo,estilo:e});}}
                            className="mt-1"
                        />}
                        <div className="mt-2 flex">
                            <Toogle label="Multiples Foraneos (Array de ID's)" value={campo.array} setValue={(e)=>setCampo({...campo,array:e})} />
                            <Popover title="Array de ID's" content="El campo aceptara mas de una referencia foranea, es decir, no sera un select, si no un Multiple Checkbox" />
                        </div>
                        {campo?.array && 
                            <div className="mt-2 flex">
                                <Toogle label="Copia Completa" value={campo.copy} setValue={(e)=>setCampo({...campo,copy:e})} />
                                <Popover 
                                    title="Copia Completa" 
                                    content="Se copiara toda la información de los foraneos incluidos, ocasiando que se desvincule del foraneo original. Util para ventas en el caso de que los productos cambien de precio, este se mantendra con el que se registro copiado de ese día. La vista de este campo no sera un select o multicheckbox, sino una tabla donde se ira añadiendo los componentes para copiar."
                                    image={CopyForeign}
                                />
                            </div>
                        }
                    </>
                }
                {campo.type=="String" &&
                    <>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Tamaño Máximo (Max Length)
                                <Popover title="Max Length" content="Número máximo de caracteres permitidos" />
                            </label>
                            <div className="mt-2">
                                <input type="number" min="0" name="maxlength" id="maxlength" value={campo.maxLength} onChange={(e)=>setCampo({...campo,maxLength:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        {!campo?.lowercase && <div className="mt-2 flex">
                            <Toogle label="MAYUSCULAS FORZADAS" value={campo.uppercase} setValue={(e)=>setCampo({...campo,uppercase:e})} />
                        </div>}
                        {!campo?.uppercase && <div className="mt-2 flex">
                            <Toogle label="minusculas forzadas" value={campo.lowercase} setValue={(e)=>setCampo({...campo,lowercase:e})} />
                        </div>}
                        {(!options && !campo?.icon) && 
                            <div className="mt-2 flex">
                                <Toogle label="TextBox" value={campo.textbox} setValue={(e)=>setCampo({...campo,textbox:e})} />
                                <Popover title="TextBox" content="Aparecera una entrada tipo TEXTAREA, elemento que permite crear un cuadro de texto de varias líneas." />
                            </div>
                        }
                        <hr className="my-4"></hr>
                        {!campo?.textbox && <div className="mt-2 flex">
                            <Toogle label="Opciones Definidas" value={options} 
                                setValue={(e)=>{
                                    if (!options) {
                                        delete campo.icon;
                                        setCampo({...campo,options:['1']})
                                    } else {
                                        delete campo.options;
                                        setCampo({...campo})
                                    }
                                    set_options(!options);
                                }}
                            />
                            <Popover title="Opciones Definidas" content="Aparecera un SELECT con las opciones definidas. Similar al campo foraneo pero NO se referencia a ninguna Tabla. Util para datos que no cambian con el tiempo." />
                        </div>}
                        {options &&
                            <>
                                <div className="mt-2 flex">
                                    <Toogle label="Multi-selección" value={campo.array} setValue={(e)=>setCampo({...campo,array:e})} />
                                    <Popover title="Multiselect" content="El campo aceptara mas de una opción, es decir, no sera un select, si no un Multiple Checkbox" />
                                </div>
                                {campo?.options?.map((o,index)=>
                                    <div>
                                        <div className="flex mt-2 mx-2" key={index}>
                                            <button
                                                type="button"
                                                className="rounded-full bg-red-600 p-1.5 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                onClick={()=>{
                                                    setCampo({...campo,options:campo.options.filter(x=>x!=o)})
                                                }}
                                            >
                                                <Icon name="MinusIcon" className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            <input type="text" name="nombre" id="nombre" value={o} onChange={(e)=>{
                                                setCampo({...campo,options:campo.options.map((z)=>{
                                                    if(z==o) z=e.target.value;
                                                    return z;
                                                })});
                                            }} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                )}
                                <div className='text-center my-4'>
                                    <button
                                        type="button"
                                        className="rounded-full bg-green-600 p-1.5 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                        onClick={()=>{
                                            campo.options.push(((campo.options.length)+1).toString());
                                            setCampo({...campo});
                                        }}
                                    >
                                        <Icon name="PlusIcon" className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </>
                        }
                        <hr className="my-4"></hr>
                        {(!options && !campo?.textbox) && <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                        </div>}
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Valor por Defecto
                                <Popover title="Default" content="Si tiene marcada la opcion de OPCIONES DEFINIDAS y quiere que se seleccione una opcion automatica, tambien se debera escribir en este campo." />
                            </label>
                            <div className="mt-2">
                                <input type="text" min="0" name="default" id="default" value={campo.default} onChange={(e)=>setCampo({...campo,default:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Number" &&
                    <>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Limite Mínimo
                                <Popover title="Limite MINIMO" content="Número mínimo permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="number" name="min" id="min" value={campo.min} onChange={(e)=>setCampo({...campo,min:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Limite Máximo
                                <Popover title="Limite MINIMO" content="Número mínimo permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="number" name="min" id="min" value={campo.max} onChange={(e)=>setCampo({...campo,max:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Resolucion DECIMAL
                                <Popover title="FLOAT" content="Si ingresa valores a esta seccion se tomara el campo como FLOAT, con punto decimal." />
                            </label>
                            <div className="mt-2">
                                <input placeholder="0.01" type="number" name="step" id="step" value={campo.step} onChange={(e)=>setCampo({...campo,step:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Valor por Defecto
                            </label>
                            <div className="mt-2">
                                <input type="number" name="default" id="default" value={campo.default} onChange={(e)=>setCampo({...campo,default:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Date" &&
                    <>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Fecha Mínima
                                <Popover title="Limite MINIMO" content="Fecha mínima permitida" />
                            </label>
                            <div className="mt-2">
                                <input type="date" name="min" id="min" value={campo.min} onChange={(e)=>setCampo({...campo,min:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Fecha Máxima
                                <Popover title="Limite MINIMO" content="Fecha máxima permitida" />
                            </label>
                            <div className="mt-2">
                                <input type="date" name="min" id="min" value={campo.max} onChange={(e)=>setCampo({...campo,max:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                            <div className="mt-2">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                    Valor por Defecto
                                </label>
                                <Toogle label="Fecha Actual o:" value={campo.default==null || campo.default==true} setValue={(e)=>setCampo({...campo,default:e})} />
                                <div className="">
                                    <input type="date" name="default" id="default" value={campo.default} onChange={(e)=>setCampo({...campo,default:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Date" &&
                    <>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Fecha y Hora Mínima
                                <Popover title="Limite MINIMO" content="Fecha y Hora mínima permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="datetime-local" name="min" id="min" value={campo.min} onChange={(e)=>setCampo({...campo,min:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Fecha y Hora Máxima
                                <Popover title="Limite MINIMO" content="Fecha y Hora máxima permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="datetime-local" name="min" id="min" value={campo.max} onChange={(e)=>setCampo({...campo,max:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                            <div className="">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                    Valor por Defecto
                                </label>
                                <Toogle label="Fecha y Hora Actual o:" value={campo.default==null || campo.default==true} setValue={(e)=>setCampo({...campo,default:e})} />
                                <div className="mt-2">
                                    <input type="datetime-local" name="default" id="default" value={campo.default} onChange={(e)=>setCampo({...campo,default:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                </div>
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Time" &&
                    <>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Hora Mínima
                                <Popover title="Limite MINIMO" content="Hora mínima permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="time" name="min" id="min" value={campo.min} onChange={(e)=>setCampo({...campo,min:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Hora Máxima
                                <Popover title="Limite MINIMO" content="Hora máxima permitido" />
                            </label>
                            <div className="mt-2">
                                <input type="time" name="min" id="min" value={campo.max} onChange={(e)=>setCampo({...campo,max:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Valor por Defecto
                            </label>
                            <Toogle label="Hora Actual o:" value={campo.default==null || campo.default==true} setValue={(e)=>setCampo({...campo,default:e})} />
                            <div className="">
                                <input type="time" name="min" id="min" value={campo.default} onChange={(e)=>setCampo({...campo,default:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Boolean" &&
                    <>
                        <div className="mt-2">
                            <Toogle label="Valor por Defecto" value={campo.default} setValue={(e)=>setCampo({...campo,default:e})} />
                        </div>
                        <div className="mt-2">
                            <div className="flex">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Texto a mostrar si es VERDADERO
                            </label>
                            <Popover title="Display TRUE" content="Texto a mostrar para las TABLAS y REPORTES" />
                            </div>
                            <div className="">
                                <input type="text" name="true_display" id="true_display" value={campo.true_display} onChange={(e)=>setCampo({...campo,true_display:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Texto a mostrar si es FALSO
                            </label>
                            <Popover title="Display FALSE" content="Texto a mostrar para las TABLAS y REPORTES" />
                            </div>
                            <div className="">
                                <input type="text" name="false_display" id="false_display" value={campo.false_display} onChange={(e)=>setCampo({...campo,false_display:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </>
                }
                {campo.type=="String" &&
                    <>
                        <Select label="Archivos Permitidos" options={[
                            {id:"*",name:"Cualquier Archivo"},
                            {id:"image/*",name:"Solo Imágenes"},
                            {id:"video/*",name:"Solo Videos"},
                            {id:"audio/*",name:"Solo Audios"}
                        ]} field="name" value={campo.accept} setValue={(e)=>setCampo({...campo,accept:e})} className="mt-1" />
                        <div className="mt-2">
                            <Toogle label="Acepta Múltiples Archivos" value={campo.array} setValue={(e)=>setCampo({...campo,array:e})} />
                        </div>
                        {campo.array && <div className="mt-2">
                            <div className="flex">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Cantidad Máxima de Archivos
                            </label>
                            </div>
                            <div className="">
                                <input type="number" name="max" id="max" value={campo.max} onChange={(e)=>setCampo({...campo,max:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>}
                        <div className="mt-2">
                            <div className="flex">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-700 flex">
                                Tamaño Límite de Archivos (MB)
                            </label>
                            </div>
                            <div className="">
                                <input type="number" name="max_size" id="max_size" value={campo.max_size} onChange={(e)=>setCampo({...campo,max_size:e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="icon" className="block text-sm font-medium leading-6 text-gray-900">
                                Incluir Icono en la parte lateral
                                <button
                                    type="button"
                                    onClick={()=>{
                                        delete campo.icon;
                                        setCampo({...campo})
                                    }}
                                    className="ml-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Borrar Icono
                                </button>
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    {campo?.icon ?
                                        <Icon name={campo.icon} className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        :
                                        <Icon name="xxxx" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    }
                                </div>
                                <input type="text" name="icon" id="icon" value={campo?.icon ? campo.icon : ""} onClick={()=>set_ShowIcon(true)} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Seleccione Icono..."/>
                            </div>
                        </div>
                    </>
                }
                {campo.type=="Mixed" &&
                    <>
                        <div className="text-center mt-4">
                            La Lógica del MIXED deberá realizarlo desde el FRONTEND
                        </div>
                    </>
                }
            </div>
        </>
    )
}