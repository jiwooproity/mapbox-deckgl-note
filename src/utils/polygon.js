import { AmbientLight, LightingEffect, PointLight } from "@deck.gl/core";
import { PolygonLayer } from "@deck.gl/layers";

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

const latLngToPolygon = ({ id, data }) => {
  return new PolygonLayer({
    id,
    data: data,
    pickable: true,
    extruded: true,
    wireframe: false,
    opacity: 0.5,
    getPolygon: (f) => f.polygon,
    getElevation: (f) => f.height,
    getFillColor: [80, 80, 80],
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51],
    },
    LightingEffect: lightingEffect,
  });
};

export { latLngToPolygon };
