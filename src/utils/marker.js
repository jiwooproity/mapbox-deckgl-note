import { IconLayer } from "@deck.gl/layers";

const ICON_MAPPING = {
  marker: { x: 0, y: 0, anchorY: 100, width: 128, height: 128, mask: true },
};

const latLngToIcon = ({ id, data }) => {
  return new IconLayer({
    id,
    data,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",
    sizeScale: 5,
    getPosition: (d) => d.coordinates,
    getSize: 5,
    getColor: (d) => [Math.sqrt(d.exits), 140, 0],
  });
};

export { latLngToIcon };
