import { useEffect, useState } from "react";

// gl package
import Map from "react-map-gl";
import { DeckGL } from "@deck.gl/react";

// Lat, Lng Data
import h3HexagonLatLng from "../../datas/h3HexagonLatLng.json";
import hexagonLatLng from "../../datas/hexagonLatLng.json";
import polygonLatLng from "../../datas/polygonLatLng.json";
import path from "../../datas/path.json";
// import heatmapCoordinates from "../../datas/heatmapCoordinates.json";
import markerLatLng from "../../datas/markerLatLng.json";
// import routeJson from "../../datas/route.json";
import tripsPath from "../../datas/tripsPath.json";

// Util Func
import { latLngToH3Hexagon, latLngToHexagon } from "../../utils/hexagon";
import { latLngToPolygon } from "../../utils/polygon";
import { ToolTip } from "../../utils/tooltip";
import { pathToLayer } from "../../utils/path";
// import { coordiToHeatmap, AGGREGATION } from "../../utils/heatmap";
import { latLngToIcon } from "../../utils/marker";
import { TripsLayer } from "@deck.gl/geo-layers";

import { onClipCoordinates } from "../../utils/clipCoordinates";

function BaseMap() {
  const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const [viewState, setViewState] = useState({
    longitude: 126.9176768,
    latitude: 37.5515208,
    zoom: 18,
  });
  const [time, setTime] = useState(0);
  const [animation] = useState({});

  const animate = () => {
    setTime((state) => (state + 1) % 1800);
    animation.id = window.requestAnimationFrame(animate);
  };

  const h3HexagonLayer = latLngToH3Hexagon({
    id: "h3HexagonLayer",
    radius: 12,
    datas: h3HexagonLatLng,
  });

  const hexagonLayer = latLngToHexagon({
    id: "heatmap",
    data: hexagonLatLng,
  });

  const polygonLayer = latLngToPolygon({
    id: "buildings",
    data: polygonLatLng,
  });

  const pathLayer = pathToLayer({
    id: "pathLayer",
    data: path,
  });

  // const heatmapLayer = coordiToHeatmap({
  //   id: "heatmapLayer",
  //   data: heatmapCoordinates,
  //   aggregation: AGGREGATION.MEAN,
  // });

  const iconLayer = latLngToIcon({
    id: "iconLayer",
    data: markerLatLng,
  });

  const tripsLayer = new TripsLayer({
    id: "trips",
    data: tripsPath,
    getPath: (d) => d.path,
    getTimestamps: (d) => d.timestamps,
    getColor: (d) => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
    opacity: 1,
    widthMinPixels: 2,
    rounded: true,
    trailLength: 180,
    currentTime: time,
    shadowEnabled: false,
  });

  const hexagonLayers = [
    polygonLayer,
    hexagonLayer,
    h3HexagonLayer,
    pathLayer,
    // heatmapLayer,
    iconLayer,
    tripsLayer,
  ];

  useEffect(() => {
    const container = document.getElementById("deckgl-wrapper");
    container.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      container.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      controller={true}
      layers={hexagonLayers}
      getTooltip={ToolTip}
      onClick={onClipCoordinates}
    >
      <Map
        mapboxAccessToken={ACCESS_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
      />
    </DeckGL>
  );
}

export default BaseMap;
