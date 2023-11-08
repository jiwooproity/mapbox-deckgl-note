import { useEffect, useState } from "react";
import { Map } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";

import {
  ArcLayer,
  GeoJsonLayer,
  IconLayer,
  LineLayer,
  PathLayer,
  PolygonLayer,
  ScatterplotLayer,
  TextLayer,
} from "@deck.gl/layers";
import { H3HexagonLayer, TripsLayer } from "@deck.gl/geo-layers";

// GeoJson - Building
import building from "../../datas/sample/building.json";
import trips from "../../datas/sample/trips.json";
import h3Hexagon from "../../datas/sample/h3hexagon.json";
import arc from "../../datas/sample/arc.json";
import text from "../../datas/sample/text.json";
import path from "../../datas/sample/path.json";
import heatmap from "../../datas/sample/heatmap.json";
import area from "../../datas/sample/area.json";
import seongnam from "../../datas/custom/korea.json";
import maskPath from "../../datas/sample/maskPath.json";
import marker from "../../datas/sample/marker.json";

import koreaJson from "../../datas/sample/korea.json";
import RealBuilding from "../../datas/seoul/buildingGeoJson.json";

// Util - Coordinates Clipboard
import { onClipCoordinates } from "../../utils/clipCoordinates";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { MaskExtension } from "@deck.gl/extensions";
// import { MaskExtension } from "@deck.gl/extensions";

const h3 = require("h3-js");

const SampleMapbox = () => {
  const [viewState, setViewState] = useState({
    longitude: 126.9176768,
    latitude: 37.5515208,
    // longitude: 126.975357465175,
    // latitude: 37.5714243158795,
    zoom: 18,
  });

  const [animation, setAnimation] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [timeSpeed, setTimeSpeed] = useState(1);

  const [cellState, setCellState] = useState([]);
  const [hexagonIndex, setHexagonIndex] = useState([]);
  const [hexagonArea, setHexagonArea] = useState([]);

  // building state
  const [collection, setCollection] = useState([]);

  const [pathCorners, setPathCorners] = useState([]);

  const [markerPostion, setMarkerPosition] = useState([]);

  const animate = () => {
    setCurrentTime((time) => (time + timeSpeed) % 2000);
    animation.id = requestAnimationFrame(animate);
  };

  const createCoordiArr = ({ coordinate }) => {
    setCollection((state) => [...state, coordinate]);
  };

  const removeOnContext = (e) => {
    e.preventDefault();
    setCollection([]);
  };

  const convertPathCorner = () => {
    const cornerPositions = trips.map((p) =>
      p.path.map((inData) => ({
        position: inData,
        color: p.color,
      }))
    );
    const convertOneArray = [];
    cornerPositions.forEach((position) => convertOneArray.push(...position));
    setPathCorners(convertOneArray);
  };

  const convertingHex = (coordinates) => {
    const res = 11;
    const getCell = h3.latLngToCell(coordinates[1], coordinates[0], res);
    setCellState([getCell]);

    const getH3Hexagons = [];
    h3Hexagon.map((data) => {
      getH3Hexagons.push({
        color: [255, (1 - data.count / 300) * 255, 0, 10],
        hex: h3.latLngToCell(data.latitude, data.longitude, 11),
      });
    });
    setHexagonIndex(getH3Hexagons);
  };

  const convertingPolyfill = (polygons) => {
    const res = 11;
    const polyfills = h3.polygonToCells(
      polygons.map((i) => [i[1], i[0]]),
      res
    );
    setHexagonArea(polyfills);
  };

  const onLoad = () => {
    convertingHex(maskPath.coordinates);
    convertingPolyfill(area);
    convertPathCorner();
  };

  useEffect(() => {
    const deckglWrapper = document.getElementById("deckgl-wrapper");
    deckglWrapper.addEventListener("contextmenu", removeOnContext);
    return () =>
      deckglWrapper.removeEventListener("contextmenu", removeOnContext);
  }, []);

  useEffect(() => {
    animation.id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation.id);
  }, [animation]);

  useEffect(() => {
    console.log(collection);
  }, [collection]);

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: marker,
    pickable: true,
    iconMapping: {
      marker: { x: 0, y: 0, anchorY: 128, width: 128, height: 128, mask: true },
    },
    getIcon: (d) => "marker",
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    sizeScale: 5,
    getPosition: (d) => [...d.coordinates, 0],
    getSize: (d) => 5,
    getColor: (d) => [255, 0, 0],
  });

  // Building
  const buildingLayer = new GeoJsonLayer({
    id: "building-geojson-layer",
    data: building,
    pickable: true,
    pointType: "text",
    extruded: true,
    getElevation: (f) => f.properties.height || 20,
    // getElevation: (f) => f.properties.HEIGHT + 10,
    getFillColor: () => [160, 180, 180, 210],
  });

  // Seongnam Area
  const seongnamLayer = new GeoJsonLayer({
    id: "seongnam-layer",
    data: seongnam,
    pickable: true,
    extruded: false,
    getLineWidth: 5,
    getFillColor: [255, 255, 255, 50],
  });

  const tripsLayer = new TripsLayer({
    id: "trips-layer",
    data: trips,
    currentTime: currentTime,
    trailLength: 180,
    shadowEnabled: false,
    rounded: true,
    widthScale: 4,
    getPath: (f) => f.path,
    getTimeStamps: (f) => f.timestamps,
    getColor: (f) => f.color,
  });

  const h3HexagonLayer = new H3HexagonLayer({
    id: "h3-hexagon-layer",
    data: hexagonIndex,
    extruded: false,
    filled: true,
    getLineWidth: () => 0.5,
    getLineColor: [255, 255, 255],
    getHexagon: (d) => d.hex,
    // getFillColor: (d) => d.color,
    getFillColor: [255, 255, 255, 10],
  });

  const h3HexagonAreaLayer = new H3HexagonLayer({
    id: "h3-hexagon-area-layer",
    data: hexagonArea,
    extruded: false,
    getHexagon: (d) => d,
    getFillColor: [160, 180, 160, 10],
    getLineColor: [255, 255, 255, 100],
  });

  const arcLayer = new ArcLayer({
    id: "arc-layer",
    data: arc,
    getWidth: 5,
    getSourcePosition: (f) => f.from.coordinates,
    getTargetPosition: (f) => f.to.coordinates,
    getSourceColor: (d) => [140, 140, 0],
    getTargetColor: (d) => [140, 140, 0],
  });

  const textLayer = new TextLayer({
    id: "text-layer",
    data: text,
    lineHeight: 2,
    getSize: 15,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center",
    getPosition: (f) => f.coordinates,
    getText: (f) => f.text,
  });

  const pathLayer = new PathLayer({
    id: "path-layer",
    data: path,
    pickable: true,
    getPath: (f) => f.path,
    getWidth: 1,
    getColor: [255, 255, 255],
    opacity: 1,
  });

  const maskPathLayer = new GeoJsonLayer({
    id: "mask-path-layer",
    operation: "mask",
    data: maskPath.pathGeoJson,
    pickable: true,
    extruded: false,
    getLineWidth: 1,
    getFillColor: [160, 160, 180, 200],
  });

  const maskGeoJsonLayer = new ScatterplotLayer({
    id: "mask-geojson-layer",
    data: [{ coordinates: maskPath.coordinates }],
    extruded: false,
    getPosition: (d) => d.coordinates,
    // getHexagon: (d) => d,
    getFillColor: [160, 180, 160, 0],
    getLineWidth: 1,
    // getLineColor: [0, 0, 0, 100],
    getRadius: 50,
    maskId: "mask-path-layer",
    extensions: [new MaskExtension()],
  });

  const heatmapLayer = new HeatmapLayer({
    id: "heatmap-layer",
    data: heatmap,
    autoHighlight: false,
    getPosition: (f) => f.coordinates,
    getWeight: (f) => f.count,
  });

  const scatterLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data: pathCorners,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (f) => f.position,
    getColor: (f) => f.color,
  });

  const lineLayer = new LineLayer({
    id: "line-layer",
    data: arc,
    getSourcePosition: (f) => [...f.from.coordinates, 500.86],
    getTargetPosition: (f) => [...f.to.coordinates, 594.36],
    getColor: (f) => {
      const z = 500.86;
      const r = z / 10000;

      return [255 * (1 - r * 2), 128 * r, 255 * r, 255 * (1 - r)];
    },
  });

  const deckglLayers = [
    buildingLayer,
    h3HexagonLayer,
    seongnamLayer,
    tripsLayer,
    // h3HexagonAreaLayer,
    arcLayer,
    textLayer,
    pathLayer,
    heatmapLayer,
    scatterLayer,
    maskPathLayer,
    maskGeoJsonLayer,
    lineLayer,
    iconLayer,
  ];

  const showTooltip = ({ object }) => {
    if (object && object.properties) {
      if (object.properties.adm_nm) {
        return object.properties.adm_nm;
      }

      if (object.properties.message) {
        return object.properties.message;
      }

      if (object.properties.name) {
        return object.properties.name;
      }

      return;
    }

    if (object) {
      if (object.message) {
        return object.message;
      }

      if (object.name) {
        return object.name;
      }
    }
  };

  return (
    <DeckGL
      controller={true}
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      layers={[...deckglLayers]}
      onClick={createCoordiArr}
      getTooltip={showTooltip}
    >
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        // mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        // mapStyle="mapbox://styles/thing9999/clogri7yp004i01rh28b859xq"
        mapStyle="mapbox://styles/dejayspark/clooe4yyg002u01pq92voe0n0"
        style={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
      />
    </DeckGL>
  );
};

export default SampleMapbox;
