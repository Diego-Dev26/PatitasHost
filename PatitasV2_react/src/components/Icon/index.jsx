import * as SolidIcons from '@heroicons/react/20/solid';
//import * as SolidIcons from '@heroicons/react/24/solid'; //mas grandes
import * as OutlineIcons from '@heroicons/react/24/outline';

export default function Icon(props) {
    if (props && props.name) {
        const { name, outline = false, ...rest } = props; // Extrae outline y el resto de los props
        const Icon = outline ? OutlineIcons[name] : SolidIcons[name];
        if (Icon)
            return <Icon {...rest} /> // Pasa solo el resto de los props
        return "❓";
    } else {
        return "Falta Nombre del Icono";
    }
}