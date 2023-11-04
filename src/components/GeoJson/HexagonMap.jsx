import { useEffect, useState } from "react";

import { Layer, Map, Source } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";

import {
  onClipCoordinates,
  onClipCoordiObject,
} from "../../utils/clipCoordinates";

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
  const [warningMark, setWarningMark] = useState([]);

  const [collection, setCollection] = useState([]);
  const [makeGeoJson, setMakeGeoJson] = useState({});

  const animate = () => {
    setTime((state) => (state + 1) % 2000);
    animation.id = requestAnimationFrame(animate);
  };

  const addCollection = ({ coordinate }) => {
    setCollection((state) => [...state, coordinate]);
    setMakeGeoJson(() => ({
      type: "Feature",
      properties: {
        name: "asdasd",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[...collection, coordinate]],
      },
    }));
  };

  const onLoad = () => {
    const warningPoint = [];
    const coordinatesDatas = coordinatesJson;
    const coordinateConvert = coordinatesDatas.map((coordi) => {
      const hex = h3.latLngToCell(coordi.latitude, coordi.longitude, 11);
      const latLngs = h3.cellToBoundary(hex).map((i) => [i[1], i[0]]);

      if (coordi.warning) {
        warningPoint.push({
          coordinates: [h3.cellToLatLng(hex)[1], h3.cellToLatLng(hex)[0]],
          message: `Warning ${coordi.warning}`,
        });
      }

      return {
        type: "Feature",
        properties: {
          hex: hex,
          color: coordi.warning ? "#E14C48" : "#e3e3e3",
          opacity: coordi.warning ? 0.4 : 0.2,
        },
        geometry: {
          type: "Polygon",
          coordinates: [latLngs],
        },
      };
    });

    setWarningMark(warningPoint);
    setHexagonArr(coordinateConvert);
  };

  const showPopup = ({ properties, geometry }) => {};

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: warningMark,
    pickable: true,
    // iconAtlas and iconMapping are required
    // getIcon: return a string

    iconMapping: {
      marker: { x: 0, y: 0, anchorY: 500, width: 128, height: 128, mask: true },
    },
    getIcon: (d) => "marker",
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    sizeScale: 5,
    getPosition: (d) => [...d.coordinates, 0],
    getSize: (d) => 5,
    getColor: (d) => [255, 0, 0],
  });

  const geojsonLayer = new GeoJsonLayer({
    id: "building",
    data: buildings,
    getElevation: () => Math.floor(Math.random() * (50 - 20) + 20),
    getPointRadius: 4,
    getLineWidth: 0,
    getFillColor: [160, 180, 180, 500],
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
    element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      setCollection([]);
      setMakeGeoJson({});
    });
    return () =>
      element.removeEventListener("contextmenu", (e) => {
        e.preventDefault();
        setCollection([]);
        setMakeGeoJson({});
      });
  }, []);

  useEffect(() => {
    console.log(makeGeoJson);
  }, [makeGeoJson]);

  return (
    <DeckGL
      depthTest={true}
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      controller={true}
      layers={[iconLayer, geojsonLayer, tripsLayer]}
      onClick={(e) => addCollection(e)}
      getTooltip={({ object }) => object && object.message && object.message}
    >
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_MY_TOKEN}
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
                "fill-antialias": true,
                "fill-outline-color": "rgb(115, 115, 115)",
                "fill-color": ["get", "color"],
                "fill-opacity": ["get", "opacity"],
              },
            }}
          />
        </Source>
      </Map>
    </DeckGL>
  );
};

export default HexagonMap;
