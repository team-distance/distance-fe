import React, { useEffect, useRef } from 'react';

const NaverMaps = ({ zoom }) => {
  const mapDiv = useRef(null);
  const { naver } = window;

  useEffect(() => {
    console.log(naver);
    const mapOptions = {
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: zoom,
      logoControlOptions: { position: naver.maps.Position.TOP_RIGHT },
      mapDataControl: false,
      scaleControl: false,
      disableKineticPan: false,
    };

    const naverMap = new naver.maps.Map(mapDiv.current, mapOptions);

    new naver.maps.Marker({
      position: new naver.maps.LatLng(37.35, 127.105399),
      map: naverMap,
      icon: {
        content:
          '<div style="width: 100px; height: 20px; background-color: yellow">하이<input type="text" /></div>',
      },
    });

    return () => {
      naverMap.destroy();
    };
  }, [zoom]);

  return <div ref={mapDiv} style={{ width: '100%', height: '55%' }}></div>;
};

export default NaverMaps;
