import { useEffect, useState } from "react";

// gl package
import Map from "react-map-gl";
import { DeckGL } from "@deck.gl/react";

// import geoJson from "../../datas/geoJsonSample.json";
import geoJsonCustom from "../../datas/custom/geoJsonCustom.json";

import { GeoJsonLayer } from "@deck.gl/layers";
import { onClipCoordinates } from "../../utils/clipCoordinates";

const GeoJsonMap = () => {
  const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState({
    // longitude: -122.4,
    // latitude: 37.74,
    // zoom: 11,
    // maxZoom: 20,
    // pitch: 30,
    // bearing: 0,
    longitude: 126.9176768,
    latitude: 37.5515208,
    zoom: 18,
  });

  const geojsonLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoJsonCustom,
    extruded: true,
    filled: true,
    pickable: true,
    getLineWidth: 20,
    getPointRadius: 4,
    getTextSize: 15,
    getElevation: 20,
    getFillColor: [160, 180, 180, 200],
    getLineColor: (f) => {
      const hex = f.properties.color;
      // convert to RGB
      return hex
        ? hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16))
        : [0, 0, 0];
    },
    getText: (f) => f.properties.name,
    pointType: "text",
  });

  useEffect(() => {
    const element = document.getElementById("deckgl-wrapper");
    element.addEventListener("contextmenu", (e) => e.preventDefault());
    return () =>
      element.removeEventListener("contextmenu", (e) => e.preventDefault());
  }, []);

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      controller={true}
      layers={[geojsonLayer]}
      onClick={(e) => onClipCoordinates(e)}
    >
      <Map
        mapboxAccessToken={ACCESS_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
      />
    </DeckGL>
  );
};

export default GeoJsonMap;
