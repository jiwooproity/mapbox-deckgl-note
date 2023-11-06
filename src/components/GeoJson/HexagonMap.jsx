import { useEffect, useState } from "react";

import { Layer, Map, Source } from "react-map-gl";
import { DeckGL } from "@deck.gl/react";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { H3HexagonLayer, TripsLayer } from "@deck.gl/geo-layers";

// import {
//   onClipCoordinates,
//   onClipCoordiObject,
// } from "../../utils/clipCoordinates";

import buildings from "../../datas/custom/buildingGeoJson.json";
import trips from "../../datas/custom/tripsCustomJson.json";
import coordinatesJson from "../../datas/custom/coordinatesJson.json";
import roadJson from "../../datas/custom/roadToLineJson.json";
import korea from "../../datas/custom/korea.json";

const h3 = require("h3-js");

const HexagonMap = () => {
  const [viewState, setViewState] = useState({
    longitude: 126.9176768,
    latitude: 37.5515208,
    // longitude: -122.4089866999972145,
    // latitude: 37.813318999983238,
    zoom: 18,
    // pitch: 50,
    // bearing: 0,
  });
  const [time, setTime] = useState(0);
  const [animation, setAnimation] = useState({});
  const [hexagonArr, setHexagonArr] = useState([]);
  const [warningMark, setWarningMark] = useState([]);

  const [collection, setCollection] = useState([]);
  const [makeGeoJson, setMakeGeoJson] = useState({});

  // h3 hexagon data
  const [h3Hexagon, setH3Hexagon] = useState([]);

  const animate = () => {
    setTime((state) => (state + 1) % 1800);
    animation.id = requestAnimationFrame(animate);
  };

  const addCollection = ({ coordinate }) => {
    setCollection((state) => [...state, coordinate]);
    setMakeGeoJson(() => ({
      type: "Feature",
      properties: {
        name: "asdasd",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[...collection, coordinate]],
      },
    }));
  };

  const onLoad = () => {
    const polygon = [
      [127.0718894736144, 37.4418217921411],
      [127.07170567869711, 37.43981789057829],
      [127.07370114124414, 37.438823393559844],
      [127.0720593124203, 37.435365224381954],
      [127.07085950257175, 37.43031523210911],
      [127.068337636106, 37.4307274853065],
      [127.06540327120183, 37.429098524625786],
      [127.06264373853796, 37.42944871869276],
      [127.05775294378685, 37.42988721773889],
      [127.05392307295709, 37.42909795191778],
      [127.05185340728072, 37.42963308995663],
      [127.04779288946217, 37.43051200196128],
      [127.04588460053299, 37.42893074766338],
      [127.04201802243514, 37.4270528765476],
      [127.0417817931324, 37.42354583039773],
      [127.04262721865746, 37.42226492489518],
      [127.04157379577495, 37.416004942870515],
      [127.04777973052978, 37.4138096042167],
      [127.0466077685687, 37.41011817769677],
      [127.04295887051082, 37.407895300854506],
      [127.04407863262931, 37.403775671586594],
      [127.04058855303181, 37.40181244932437],
      [127.03704227201263, 37.40109114394814],
      [127.03843158349456, 37.39811243123083],
      [127.03924555228116, 37.3908535256099],
      [127.03632815215333, 37.388849023555814],
      [127.03426783123851, 37.388308232305825],
      [127.03068038452054, 37.38017793042113],
      [127.02866256652491, 37.37903502964897],
      [127.02723683899984, 37.37560170924492],
      [127.02846594945842, 37.371458760827615],
      [127.04875146748013, 37.36557359647229],
      [127.05450223686142, 37.36032017999167],
      [127.0782037602419, 37.34852898205073],
      [127.11729327894481, 37.33290500888561],
      [127.13787792186316, 37.3398109313155],
      [127.13743113045304, 37.344397031421614],
      [127.13267320201396, 37.34882966372781],
      [127.13240484525645, 37.351234474345645],
      [127.1313098764402, 37.35151926727521],
      [127.13379950084446, 37.35849669255158],
      [127.1392461647794, 37.35954218219404],
      [127.14305388544288, 37.35919704805151],
      [127.15123571065224, 37.361921528972836],
      [127.16015866783256, 37.37276292889697],
      [127.16241264334943, 37.37959371312202],
      [127.17688427606342, 37.384763912032724],
      [127.17726495491426, 37.38702362394969],
      [127.16887108215023, 37.39232736418428],
      [127.16869554612458, 37.3960616390151],
      [127.17112393416724, 37.39749712603084],
      [127.17208209139888, 37.40155076739855],
      [127.17476516491702, 37.40567224131321],
      [127.17787074751071, 37.412756611899404],
      [127.17696299575083, 37.4145513231215],
      [127.18017122852012, 37.41600398876688],
      [127.18523232344307, 37.415094380491794],
      [127.18659509638285, 37.41891258709127],
      [127.1954280657744, 37.424910471958704],
      [127.19268132173698, 37.42562568349457],
      [127.19447615537037, 37.433314185027406],
      [127.19326883106079, 37.438192604153066],
      [127.19630830423169, 37.444638081952746],
      [127.1901685139424, 37.45721490813494],
      [127.18272803860916, 37.459546736244285],
      [127.1801682880022, 37.47338761549747],
      [127.17639661318329, 37.47239874399858],
      [127.17229598866466, 37.47088670789786],
      [127.16522597486886, 37.469032993077946],
      [127.1632692370727, 37.47158319311998],
      [127.15521357058006, 37.47166607408388],
      [127.15447521710954, 37.47367329009656],
      [127.13259757719587, 37.47435292534375],
      [127.13308590033803, 37.46762455117659],
      [127.12907202918271, 37.467894787417],
      [127.12537330238905, 37.469355376418854],
      [127.12393640134938, 37.465666166402194],
      [127.11722879789595, 37.46214601505379],
      [127.11675671256947, 37.4580727441974],
      [127.1136022583465, 37.4614150198398],
      [127.10474601881536, 37.46262014159452],
      [127.10287837730728, 37.458822942035574],
      [127.09813228570736, 37.45889978871424],
      [127.09723509986658, 37.46109259850808],
    ];
    const res = 9;
    const h3HexagonData = h3.polygonToCells(
      polygon.map((i) => [i[1], i[0]]),
      res
    );

    const warningPoint = [];
    const coordinatesDatas = coordinatesJson;
    const coordinateConvert = coordinatesDatas.map((coordi) => {
      const hex = h3.latLngToCell(coordi.latitude, coordi.longitude, 11);
      const latLngs = h3.cellToBoundary(hex).map((i) => [i[1], i[0]]);

      if (coordi.people >= 100) {
        warningPoint.push({
          coordinates: [h3.cellToLatLng(hex)[1], h3.cellToLatLng(hex)[0]],
          message: `Warning ${coordi.warning}`,
        });
      }

      return {
        type: "Feature",
        properties: {
          hex: hex,
          // color: coordi.warning ? "#E14C48" : "#c5c5c5",
          color: coordi.people >= 100 ? "#E14C48" : "#c5c5c5",
          opacity: coordi.warning ? 0.4 : 0.2,
        },
        geometry: {
          type: "Polygon",
          coordinates: [latLngs],
        },
      };
    });

    const diskTarget = [126.92015474691122, 37.55117659169174];
    const diskHex = h3.latLngToCell(diskTarget[1], diskTarget[0], 11);
    const h3GridDisk = h3.gridDisk(diskHex, 1);
    const latLngGrid = h3GridDisk.map((hex) => {
      return h3.cellToBoundary(hex).map((i) => [i[1], i[0]]);
    });

    latLngGrid.forEach((grid, index) => {
      coordinateConvert.push({
        type: "Feature",
        properties: {
          hex: "",
          color: index === 0 ? "#E14C48" : "#c5c5c5",
          opacity: index === 0 ? 0.4 : 0.2,
        },
        geometry: {
          type: "Polygon",
          coordinates: [grid],
        },
      });
    });

    setH3Hexagon(h3HexagonData);
    setWarningMark(warningPoint);
    setHexagonArr(coordinateConvert);
  };

  const showPopup = ({ properties, geometry }) => {};

  const iconLayer = new IconLayer({
    id: "icon-layer",
    data: warningMark,
    pickable: true,
    iconMapping: {
      marker: { x: 0, y: 0, anchorY: 128, width: 128, height: 128, mask: true },
    },
    getIcon: (d) => "marker",
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    sizeScale: 5,
    getPosition: (d) => [...d.coordinates, 0],
    getSize: (d) => 5,
    getColor: (d) => [255, 0, 0],
  });

  const hexagonLayer = new H3HexagonLayer({
    id: "h3-hexagon-layer",
    data: h3Hexagon,
    getHexagon: (d) => d,
    getFillColor: () => [255, 255, 255, 50],
    extruded: false,
    // getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0],
    // getElevation: (d) => d.count,
  });

  const geojsonLayer = new GeoJsonLayer({
    id: "building",
    data: buildings,
    getElevation: (f) => f.properties.height || 20,
    getPointRadius: 4,
    getLineWidth: 2,
    lineWidthMinPixels: 0.5,
    getFillColor: [160, 180, 180, 210],
    getText: showPopup,
    pointType: "text",
    extruded: true,
  });

  const seongnamLayer = new GeoJsonLayer({
    id: "seongnameGeoJson",
    data: korea,
    getLineWidth: 0.2,
    lineWidthMinPixels: 0.5,
    opacity: 1,
    pickable: true,
    getFillColor: [160, 180, 180, 30],
  });

  const tripsLayer = new TripsLayer({
    id: "trips",
    data: trips,
    getPath: (f) => f.path,
    getTimeStamps: (f) => f.timestamps,
    getColor: (f) => f.color,
    currentTime: time,
    trailLength: 180,
    fadeTrail: true,
    widthMinPixels: 2,
    shadowEnabled: false,
    rounded: true,
  });

  useEffect(() => {
    animation.id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation.id);
  }, [animation]);

  useEffect(() => {
    const init = (e) => {
      e.preventDefault();
      setCollection([]);
      setMakeGeoJson({});
    };

    const element = document.getElementById("deckgl-wrapper");
    element.addEventListener("contextmenu", init);
    return () => element.removeEventListener("contextmenu", init);
  }, []);

  useEffect(() => {
    console.log(collection);
  }, [collection]);

  return (
    <>
      <DeckGL
        depthTest={true}
        initialViewState={viewState}
        onViewStateChange={(e) => setViewState(e.viewState)}
        controller={true}
        layers={[
          hexagonLayer,
          iconLayer,
          geojsonLayer,
          seongnamLayer,
          tripsLayer,
        ]}
        onClick={(e) => addCollection(e)}
        getTooltip={({ object }) => {
          return object && object.properties && object.properties.adm_nm;
        }}
      >
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_MY_TOKEN}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          style={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
        >
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: hexagonArr,
            }}
          >
            <Layer
              id="polygon-layer"
              type="fill"
              paint={{
                "fill-antialias": true,
                "fill-outline-color": "rgb(86, 86, 86)",
                "fill-color": ["get", "color"],
                "fill-opacity": ["get", "opacity"],
              }}
            />
          </Source>
        </Map>
      </DeckGL>
      <div
        style={{
          position: "absolute",
          bototm: 0,
          left: 0,
        }}
      >
        <button>재생 / 일시정지</button>
      </div>
    </>
  );
};

export default HexagonMap;
