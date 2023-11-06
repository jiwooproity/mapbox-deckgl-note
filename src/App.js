import "mapbox-gl/dist/mapbox-gl.css";
import "./style/global.css";
import BaseMap from "./components/Map/BaseMap";
import GeoJsonMap from "./components/GeoJson/GeoJsonMap";
import HexagonMap from "./components/GeoJson/HexagonMap";
import SampleMapbox from "./components/Sample/SampleMapbox";

function App() {
  return (
    <div className="map-container">
      {/* <BaseMap /> */}
      {/* <GeoJsonMap /> */}
      {/* <HexagonMap /> */}
      <SampleMapbox />
    </div>
  );
}

export default App;
