import { useEffect, useState } from "react";

import { Layer, Map, Source } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";

import { onClipCoordiObject } from "../../utils/clipCoordinates";

import buildings from "../../datas/custom/buildingGeoJson.json";
import trips from "../../datas/custom/tripsCustomJson.json";
import coordinatesJson from "../../datas/custom/coordinatesJson.json";

const h3 = require("h3-js");

const HexagonMap = () => {
  const [viewState, setViewState] = useState({
    longitude: 126.9176768,
    latitude: 37.5515208,
    zoom: 18,
    // pitch: 50,
    // bearing: 0,
  });
  const [time, setTime] = useState(0);
  const [animation, setAnimation] = useState({});
  const [hexagonArr, setHexagonArr] = useState([]);

  const animate = () => {
    setTime((state) => (state + 1) % 1800);
    animation.id = requestAnimationFrame(animate);
  };

  const onLoad = () => {
    const coordinatesDatas = coordinatesJson;
    const coordinateConvert = coordinatesDatas.map((coordi) => {
      const hex = h3.latLngToCell(coordi.latitude, coordi.longitude, 11);
      const latLngs = h3.cellToBoundary(hex).map((i) => [i[1], i[0]]);
      return {
        type: "Feature",
        properties: {
          hex: hex,
        },
        geometry: {
          type: "Polygon",
          coordinates: [latLngs],
        },
      };
    });

    console.log(coordinateConvert);
    setHexagonArr(coordinateConvert);
  };

  const showPopup = ({ properties, geometry }) => {};

  const geojsonLayer = new GeoJsonLayer({
    id: "building",
    data: buildings,
    getElevation: (f) => f.properties.height || 20,
    getPointRadius: 4,
    getLineWidth: 0,
    getFillColor: [160, 180, 180, 200],
    getText: showPopup,
    pointType: "text",
    extruded: true,
  });

  const tripsLayer = new TripsLayer({
    id: "trips",
    data: trips,
    getPath: (f) => f.path,
    getTimeStamps: (f) => f.timestamps,
    getColor: (f) => f.color,
    currentTime: time,
    trailLength: 180,
    widthMinPixels: 1,
    shadowEnabled: false,
    rounded: true,
  });

  useEffect(() => {
    animation.id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation.id);
  }, [animation]);

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
      layers={[geojsonLayer, tripsLayer]}
      onClick={onClipCoordiObject}
    >
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
      >
        <Source
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: hexagonArr,
          }}
        >
          <Layer
            {...{
              id: "polygon-layer",
              type: "fill",
              paint: {
                "fill-outline-color": "white",
                "fill-color": "#E14C48",
                "fill-opacity": 0.7,
              },
            }}
          />
        </Source>
      </Map>
    </DeckGL>
  );
};

export default HexagonMap;
