// Importaciones necesarias
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import "./MapThumbnail.css";

const MapThumbnail = ({ latitude, longitude, showCoords = false }) => {
    const mapRef = useRef(null);
    const mapId = useRef(`map_${Math.random().toString(36).substring(2, 9)}`).current;

    // Función para abrir Google Maps en una nueva pestaña
    const openGoogleMaps = () => {
        window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    };

    useEffect(() => {
        if (mapRef.current) {
            const map = L.map(mapId, {
                center: [latitude, longitude],
                zoom: 13,
                dragging: false,
                touchZoom: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                zoomControl: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([latitude, longitude]).addTo(map);

            return () => map.remove();
        }
    }, [latitude, longitude, mapId]);

    return (
        <div className='w-36'>
            {(latitude && longitude) ?
                <div className="map-thumbnail-container" onClick={openGoogleMaps}>
                    {showCoords && (
                        <div className="coords-text">
                            <p>{latitude}</p>
                            <p>{longitude}</p>
                        </div>
                    )}
                    <div className="overlay">
                        <ArrowUpRightIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div id={mapId} className="w-36 h-32" ref={mapRef} />
                </div> :
                "-"
            }
        </div>
    );
};

export default MapThumbnail;
