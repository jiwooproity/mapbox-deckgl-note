import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { H3HexagonLayer } from "@deck.gl/geo-layers";

const h3 = require("h3-js");

const latLngToHexagon = ({ id, data }) => {
  return new HexagonLayer({
    id,
    data,
    colorRange: [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78],
    ],
    coverage: 1,
    elevationRange: [0, 2],
    elevationScale: 20,
    extruded: true,
    getPosition: (d) => d.coordinates,
    pickable: true,
    radius: 12,
    upperPercentile: 1000,
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51],
    },
    transitions: {
      elevationScale: 0.1,
    },
  });
};

const latLngToH3Hexagon = ({ id, datas, radius }) => {
  const h3Cell = datas.map((data) => ({
    hex: h3.latLngToCell(data.coordinates[1], data.coordinates[0], radius),
    count: data.count,
  }));

  return new H3HexagonLayer({
    id,
    data: h3Cell,
    wireframe: false,
    filled: true,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getHexagon: (d) => d.hex,
    getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0],
    getElevation: (d) => d.count,
  });
};

export { latLngToHexagon, latLngToH3Hexagon };
