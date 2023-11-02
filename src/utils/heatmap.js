import { HeatmapLayer } from "@deck.gl/aggregation-layers";

export const AGGREGATION = {
  SUM: "SUM",
  MEAN: "MEAN",
};

const coordiToHeatmap = ({ id, data, aggregation }) => {
  return new HeatmapLayer({
    id,
    data,
    getPosition: (d) => d.coordinates,
    getWeight: (d) => d.weight,
    aggregation,
  });
};

export { coordiToHeatmap };
