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

deck.gl은 위도와 경도 ( coordinates ), 위치 기반 데이터를 통해 데이터 시각화를 할 수 있습니다.<br/>
@deck.gl 라이브러리와 react를 연동하여 mapbox 맵 데이터 위에 레이어를 덧씌워 longitude, latitude 데이터를 가지고 위치를 매핑하고 폴리곤, 헥사곤 쉐잎을 렌더링할 수 있습니다.<br/>

참고한 deck.gl 레이어 샘플<br/>
https://deck.gl/examples

![image](https://github.com/jiwooproity/mapbox-deckgl-note/assets/58384366/9f24fed3-fa12-4d81-b4c2-858e007c512c)
![image](https://github.com/jiwooproity/mapbox-deckgl-note/assets/58384366/7f8fc8bc-d14a-45b9-aca1-073bf3603311)


## 육각형 계층의 인덱스를 구하는 방법

육각형 계층의 인덱스 값을 구하기 위해 사용한 라이브러리는 Uber h3-js를 활용하였습니다.<br/>
h3-js를 통해 longitude, latitude 중심 좌표를 기준으로 육각형 모양의 좌표 값을 구할 수 있습니다. ( radius 값도 포함하여 Scale도 조정 가능 )
