import "mapbox-gl/dist/mapbox-gl.css";
import "./style/global.css";
import BaseMap from "./components/Map/BaseMap";

function App() {
  return (
    <div className="map-container">
      <BaseMap />;
    </div>
  );
}

export default App;
