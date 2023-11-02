import "mapbox-gl/dist/mapbox-gl.css";
import "./style/global.css";
import BaseMap from "./components/Map/BaseMap";
import { csv } from "d3-request";
import { useEffect, useState } from "react";

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv"; // eslint-disable-lines

function App() {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    csv(DATA_URL, (error, response) => {
      if (!error) {
        const data = response.map((d) => [Number(d.lng), Number(d.lat)]);
        setCsvData(data);
      }
    });
  }, []);

  return (
    <div className="map-container">
      <BaseMap data={csvData} />;
    </div>
  );
}

export default App;
