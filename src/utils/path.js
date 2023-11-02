import { PathLayer } from "@deck.gl/layers";

const pathToLayer = ({ id, data }) => {
  return new PathLayer({
    id,
    data,
    pickable: true,
    widthScale: 0.1,
    widthMinPixels: 2,
    getPath: (d) => d.coordinates,
    getColor: (d) => d.color,
    getWidth: (d) => 5,
  });
};

export { pathToLayer };
