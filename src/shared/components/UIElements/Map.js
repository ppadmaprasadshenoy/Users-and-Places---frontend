import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoicGFkbWFwcmFzYWQiLCJhIjoiY2xycXE4aXd3MDN4ajJpcnVzazBweWw3ZiJ9.muSCOVATPVYZP55pnuqhhg';

export const Map = (props) => {
    const mapContainer = useRef(null);

    const { center, zoom } = props;

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center,
            zoom: zoom
        });

        new mapboxgl.Marker().setLngLat(center).addTo(map);

        return () => map.remove();
    }, [center, zoom]);

    return (
        <div
            ref={mapContainer}
            className={`map ${props.className}`}
            style={props.style}
        />
    );
};
