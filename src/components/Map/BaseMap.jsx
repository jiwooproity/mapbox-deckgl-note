import { useEffect, useState } from "react";

import Map, { Marker } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { IconLayer, PolygonLayer } from "@deck.gl/layers";
import {
  AmbientLight,
  LightingEffect,
  MapController,
  PointLight,
} from "@deck.gl/core";
import { H3HexagonLayer } from "@deck.gl/geo-layers";

const h3 = require("h3-js");

const INITIAL_VIEW_STATE = {
  longitude: 126.9176768,
  latitude: 37.5515208,
  zoom: 18,
  pitch: 15,
  bearing: 80,
  maxPitch: 85,

  // hexagon
  // longitude: -1.415727,
  // latitude: 52.232395,
  // zoom: 6.6,
  // minZoom: 5,
  // maxZoom: 15,
  // pitch: 40.5,
  // bearing: -27,

  // build
  // longitude: 127.108265,
  // latitude: 37.366766,
  // zoom: 13,
  // pitch: 45,
  // bearing: 0,
};

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const DEFAULT_THEME = {
  buildingColor: [80, 80, 80],
  material,
  effects: [lightingEffect],
};

function getTooltip({ object }) {
  if (!object) {
    return null;
  }

  if (object.name) {
    return `${object.name}`;
  } else {
    const lat = object.position[0];
    const lng = object.position[1];
    const count = object.points.length;

    return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
    ${count} Accidents`;
  }
}

const hexagonLatlngData = [
  {
    count: 100,
    coordinate: [126.91795953532062, 37.55161973943634],
  },
  {
    count: 85,
    coordinate: [126.91814881357891, 37.551597404426545],
  },
  {
    count: 45,
    coordinate: [126.91783712837427, 37.551771328321266],
  },
];

function BaseMap({ data, radius = 5, upperPercentile = 1000, coverage = 1 }) {
  const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState({ ...INITIAL_VIEW_STATE });

  const getH3Cell = hexagonLatlngData.map((hex) => ({
    hex: h3.latLngToCell(hex.coordinate[1], hex.coordinate[0], 12),
    count: hex.count,
  }));
  // const layers = [new LineLayer({ id: "line-layer", data })];

  const hexagonLayers = [
    new PolygonLayer({
      id: "buildings",
      pickable: true,
      data: [
        {
          name: "Dejay",
          height: 50,
          polygon: [
            [126.91775767289892, 37.55159472863948],
            [126.91765954541366, 37.551496859597414],
            [126.91753549051653, 37.551572528480136],
            [126.91763401286639, 37.551668257392635],
          ],
        },
        {
          name: "Dejay",
          height: 60,
          polygon: [
            [126.91769192403815, 37.55157495892143],
            [126.91764523136874, 37.55152171387055],
            [126.91756762162086, 37.5515768674668],
            [126.91763131092173, 37.55164005412116],
          ],
        },
        {
          name: "옆 건물?",
          height: 80,
          polygon: [
            [126.91750350068156, 37.55164699268984],
            [126.9174350868464, 37.551684172174646],
            [126.91741814601328, 37.55166975612081],
            [126.91733023605754, 37.551726511417456],
            [126.91746424607452, 37.5517667609046],
            [126.91757207850821, 37.55170273613222],
          ],
        },
        {
          name: "옆 옆 건물?",
          height: 55,
          polygon: [
            [126.91787531259403, 37.55151099567986],
            [126.91778526068764, 37.55142625286814],
            [126.91768553277748, 37.55149116266542],
            [126.91777441699692, 37.55157472982053],
          ],
        },
      ],
      extruded: true,
      wireframe: false,
      opacity: 0.5,
      getPolygon: (f) => f.polygon,
      getElevation: (f) => f.height,
      getFillColor: DEFAULT_THEME.buildingColor,
      material: DEFAULT_THEME.material,
    }),
    // new HexagonLayer({
    //   id: "heatmap",
    //   colorRange,
    //   coverage,
    //   data: [
    //     [126.91795953532062, 37.55161973943634],
    //     [126.91795953532062, 37.55161973943634],
    //     [126.91795953532062, 37.55161973943634],
    //     [126.91795953532062, 37.55161973943634],
    //     [126.91814881357891, 37.551597404426545],
    //     [126.91814881357891, 37.551597404426545],
    //     [126.91814881357891, 37.551597404426545],
    //     [126.91809862193885, 37.55180302792805],
    //     [126.91809862193885, 37.55180302792805],
    //     [126.91783712837427, 37.551771328321266],
    //     [126.91783712837427, 37.551771328321266],
    //     [126.91783712837427, 37.551771328321266],
    //     [126.91783712837427, 37.551771328321266],
    //     [126.91783712837427, 37.551771328321266],
    //   ],
    //   elevationRange: [0, 10],
    //   elevationScale: data && data.length ? 50 : 0,
    //   extruded: true,
    //   getPosition: (d) => d,
    //   pickable: true,
    //   radius,
    //   upperPercentile,
    //   material,
    //   transitions: {
    //     elevationScale: 1,
    //   },
    // }),
    new H3HexagonLayer({
      id: "h3-hexagon-layer",
      data: getH3Cell,
      wireframe: false,
      filled: true,
      extruded: true,
      elevationScale: 1,
      getHexagon: (d) => d.hex,
      getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0],
      getElevation: (d) => d.count,
    }),
    new IconLayer({
      id: `icon-layer`,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      getIcon: () => "marker",
      getSize: 20,
      sizeScale: 5,
      data: [
        {
          name: "Dejay",
          coordinates: [126.91764418634864, 37.55158103980047],
        },
      ],
      opacity: 1,
    }),
  ];

  useEffect(() => {
    const container = document.getElementById("deckgl-wrapper");
    container.addEventListener("contextmenu", (e) => e.preventDefault());
    return () =>
      container.addEventListener("contextmenu", (e) => e.preventDefault());
  }, []);

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      controller={true}
      layers={hexagonLayers}
      getTooltip={getTooltip}
      onClick={(e) => alert(`[${e.coordinate}]`)}
    >
      <Map
        mapboxAccessToken={ACCESS_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
      >
        {/* <Marker longitude={126.91762377046803} latitude={37.55158227603454} /> */}
      </Map>
    </DeckGL>
    // <Map
    //   mapboxAccessToken={ACCESS_TOKEN}
    //   initialViewState={{
    //     longitude: 126.9176768,
    //     latitude: 37.5515208,
    //     zoom: 14,
    //   }}
    //   style={{ width: "100%", height: "100%" }}
    //   mapStyle="mapbox://styles/mapbox/streets-v9"
    // >
    // </Map>
  );
}

export default BaseMap;
