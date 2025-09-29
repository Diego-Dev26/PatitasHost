import React, { useState } from 'react';
import Icon from '../Icon';

export default function Popover ({title,content,image,icon="InformationCircleIcon",label}) {
    const [show,set_show]=useState(false);

  return (
    <>
        <div className="ml-2 flex" onMouseEnter={()=>set_show(true)} onMouseLeave={()=>set_show(false)}>
            {label}
            <Icon name="InformationCircleIcon" className="h-5 w-5"/>
        </div>
        {show &&
            <div className="absolute z-50 bg-white rounded-xl p-2 shadow-xl border-2 border-gray-500 mt-8">
            {title && 
                <div className='border-b-2 pb-2 my-2'>
                    {title}
                </div>
            }
            <div className=''>
                {content}
                {image &&
                    <img src={image} className='mt-4' />
                }
            </div>
            </div>
        }
    </>
  );
}