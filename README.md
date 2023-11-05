## mapbox-deckgl-note

Mapbox + deck.gl 을 활용한 맵 데이터 시각화

Mapbox API 사용을 위해선 회원가입 및 토큰 발급이 필요합니다.
토큰 발급은 로그인 시 대쉬보드에서 확인이 가능하며 발급 받은 토큰을 개발 소스에 입력하면 맵 레이어를 확인할 수 있게 됩니다.

무료 범위 : 50,000 View & 50GB 데이터 처리 제한<br/>
https://www.mapbox.com/

## Mapbox 기능

기본 적으로 위도와 경도를 기준으로 Marker, Polygon, Line 처리 등 다양한 API 기능을 사용할 수 있습니다.<br/>
입체적인 3D 지도 조작이 가능하며, 컨트롤 기능은 Mapbox API에서 지원됩니다.

다양한 GLTF 모델링 파일을 Three.js 혹은 ThreeBox를 통해 렌더링도 가능하도록 라이브러리를 연결하여 사용할 수 있습니다.<br/>
맵 위에 3D 모델링, Marker 등을 렌더링하는 것은 레이어 위에 레이어를 덧씌워 위도와 경도를 비교하여 매칭되는 위치에 표시하는 방식이라고 생각하면 됩니다.

당연하게도 Web GL 같은 2D 및 3D 그래픽을 렌더링하기 위한 API도 사용 가능하여 T맵과 같은 건물 데이터, 위치 이동 등 다양한 시도가 가능합니다.<br/>

## deck.gl

맵 좌표계 EPSG 4326
WebGL 기반의 대용량 데이터의 시각화 분석을 돕는 라이브러리입니다.

유동 경로 TricksLayer
path 좌표를 따라 실제 인구 유동 경로, 차량 이동 경로 등 다양한 데이터 시각화 시도가 가능합니다.

GeoJson
Building ( Polygon / MultiPolygon ), Line, Text Tooltip, Point 등 건물, 선, 포인트 강조 다양한 시도를 할 수 있습니다.
국가공간정보포털에서 GIS 맵 데이터, 지표 데이터 등 Shape 파일을 GeoJson으로 변환하여 데이터를 시각화 할 수 있습니다.
단, 사용하는 BaseMap에 대한 좌표계와 동일한 조건을 가지고 변환 후 시각화를 진행해야 합니다.

https://deck.gl/examples

![image](https://github.com/jiwooproity/mapbox-deckgl-note/assets/58384366/9f24fed3-fa12-4d81-b4c2-858e007c512c)
![image](https://github.com/jiwooproity/mapbox-deckgl-note/assets/58384366/7f8fc8bc-d14a-45b9-aca1-073bf3603311)


## 프로젝트 구성 전 목표

좌표계에 대한 이해
GeoJson 형성에 필요한 Format 형태 파악
map-gl, deck.gl 레이어 설정을 통한 맵 데이터 시각화 방법
유동 경로 수단 표시를 위한 구분 방법 ( 버스, 지하철, 도보 등 .. )
