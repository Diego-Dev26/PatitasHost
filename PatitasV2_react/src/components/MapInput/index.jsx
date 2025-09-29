import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapInput.css";

const MapInput = ({
  label = "",
  icon = "",
  coordinates,
  setCoordinates,
  edit = true,
  latDefault = "-17.3938",
  lonDefault = "-66.1568",
}) => {
  const mapRef = useRef(null);
  const mapId = useRef(
    `map_${Math.random().toString(36).substring(2, 9)}`
  ).current;
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const validateAndSetInput = (value, setter) => {
    if (/^-?\d*\.?,?\d*$/.test(value)) {
      setter(formatCoordinate(value));
    }
  };

  function formatCoordinate(value) {
    // Convierte a número flotante
    const num = parseFloat(value);
    // Comprueba si el número es entero. Si lo es, agrega ".0" al final.
    if (num % 1 === 0) {
      return num.toFixed(1);
    } else {
      // Limita a un máximo de 8 decimales y elimina ceros finales innecesarios
      return num.toFixed(8).replace(/\.?0+$/, "");
    }
  }

  function updateMarkerLat(newLat) {
    validateAndSetInput(newLat, (lat) =>
      setCoordinates({ longitude: coordinates.longitude, latitude: lat })
    );
  }

  function updateMarkerLon(newLon) {
    validateAndSetInput(newLon, (lon) =>
      setCoordinates({ latitude: coordinates.latitude, longitude: lon })
    );
  }

  const updatePosition = (latlng) => {
    const updatedLat = latlng.lat.toFixed(8);
    const updatedLng = latlng.lng.toFixed(8);
    setCoordinates({ latitude: updatedLat, longitude: updatedLng });
  };

  useEffect(() => {
    if (!mapRef.current || mapRef.current._leaflet_id) return;
    const initializedMap = L.map(mapId).setView(
      [parseFloat(latDefault), parseFloat(lonDefault)],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(initializedMap);

    var markerInit;
    if (icon) {
      const customIcon = new L.Icon({
        iconUrl: icon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      markerInit = L.marker([parseFloat(latDefault), parseFloat(lonDefault)], {
        icon: customIcon,
        draggable: edit,
      });
    } else {
      markerInit = L.marker([parseFloat(latDefault), parseFloat(lonDefault)], {
        draggable: edit,
      });
    }
    markerInit.addTo(initializedMap);

    if (edit) {
      // Solo agregar listeners si edit es true
      markerInit.on("dragend", function (e) {
        const position = markerInit.getLatLng();
        updatePosition(position);
      });

      initializedMap.on("click", function (e) {
        markerInit.setLatLng(e.latlng);
        updatePosition(e.latlng);
      });
    }
    setMarker(markerInit);
    setMap(initializedMap);
  }, []);

  useEffect(() => {
    if (map && marker && coordinates.latitude && coordinates.longitude) {
      const newLatLng = new L.LatLng(
        parseFloat(coordinates.latitude),
        parseFloat(coordinates.longitude)
      );
      marker.setLatLng(newLatLng);
      //map.setView(newLatLng, map.getZoom());
      map.panTo(newLatLng);
    }
  }, [coordinates]);

  /*useEffect(() => {
        if (map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 0);
        }
    }, [map]);*/ //falta probar en react, extraido de ionic

  return (
    <>
      <label className="block text-sm font-medium text-gray-800">{label}</label>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="latitude_input"
            className="block text-xs font-medium text-gray-600"
          >
            Latitud
          </label>
          <input
            id="latitude_input"
            type="text"
            readOnly={!edit}
            value={coordinates?.latitude || ""}
            onChange={(e) => updateMarkerLat(e.target.value)}
            className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="longitude_input"
            className="block text-xs font-medium text-gray-600"
          >
            Longitud
          </label>
          <input
            id="longitude_input"
            type="text"
            readOnly={!edit}
            value={coordinates?.longitude || ""}
            onChange={(e) => updateMarkerLon(e.target.value)}
            className="mt-1 focus:ring-blue-300 focus:border-blue-300 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div id={mapId} className="h-96 w-full mt-4" ref={mapRef} />
    </>
  );
};

export default MapInput;
