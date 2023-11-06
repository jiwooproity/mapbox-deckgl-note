import { DeckGL } from "@deck.gl/react";
import { useEffect, useState } from "react";
import { Map } from "react-map-gl";

// GeoJson - Building
import building from "../../datas/custom/buildingGeoJson.json";
import { GeoJsonLayer } from "@deck.gl/layers";

const SampleMapbox = () => {
  const [viewState, setViewState] = useState({
    longitude: 126.9176768,
    latitude: 37.5515208,
    zoom: 18,
  });

  const removeOnContext = (e) => {
    e.preventDefault();
  };

  const onLoad = () => {};

  useEffect(() => {
    const deckglWrapper = document.getElementById("deckgl-wrapper");
    deckglWrapper.addEventListener("contextmenu", removeOnContext);
    return () =>
      deckglWrapper.removeEventListener("contextmenu", removeOnContext);
  }, []);

  // Building
  const buildingLayer = new GeoJsonLayer({
    id: "building-geojson",
    data: building,
    pointType: "text",
    extruded: true,
    getElevation: (f) => f.properties.height || 20,
    getFillColor: () => [160, 180, 180, 210],
  });

  return (
    <DeckGL
      controller={true}
      initialViewState={viewState}
      onViewStateChange={(e) => setViewState(e.viewState)}
      layers={[buildingLayer]}
    >
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_MY_TOKEN}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        onLoad={onLoad}
      />
    </DeckGL>
  );
};

export default SampleMapbox;
