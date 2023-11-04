const onClipCoordinates = async ({ coordinate }) => {
  await navigator.clipboard.writeText(`[${coordinate}],`);
};

const onClipCoordiObject = async ({ coordinate }) => {
  await navigator.clipboard.writeText(
    `{longitude: ${coordinate[0]}, latitude: ${coordinate[1]}}`
  );
};

export { onClipCoordinates, onClipCoordiObject };
