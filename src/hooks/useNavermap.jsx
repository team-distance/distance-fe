import { useEffect, useState } from 'react';

const useNavermap = () => {
  const NAVER_MAP_SCRIPT_SRC = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NCP_CLIENT_ID}`;
  const [map, setMap] = useState(null);

  useEffect(() => {
    const existingScript = document.querySelector(
      `script[src="${NAVER_MAP_SCRIPT_SRC}"]`
    );

    if (existingScript) return;

    const script = document.createElement('script');
    script.src = NAVER_MAP_SCRIPT_SRC;
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      const map = window.naver;
      console.log(map);
    });

    return () => {
      script.removeEventListener('load', () => {});
    };
  });

  useEffect(() => {
    console.log(map);
  }, [map]);

  return map;
};

export default useNavermap;
