const TYPE = {
  HEXAGON: "hexagon",
  H3_HEXAGON: "h3Hexagon",
  BUILDING: "building",
  PATH: "path",
};

const ToolTip = ({ object }) => {
  if (!object) return;

  switch (object.type) {
    case TYPE.BUILDING:
      return `Build Name : ${object.name}
      Height : ${object.height}`;
    case TYPE.PATH:
      return `${object.name}`;
    default:
      if (object.position) {
        return `Longitude : ${object.position[0]}
        Latitude : ${object.position[1]}`;
      }
      break;
  }
};

export { ToolTip };
