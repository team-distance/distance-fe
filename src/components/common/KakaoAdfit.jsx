import React from 'react';

const KakaoAdfit = () => {
  const noAdFallback = () => {
    console.log('no ad');
  };

  return (
    <ins
      class="kakao_ad_area"
      style={{ display: 'none' }}
      data-ad-unit="DAN-s3Wkxhn844Oelvxw"
      data-ad-onfail={noAdFallback}
      data-ad-width="320"
      data-ad-height="50"
    ></ins>
  );
};

export default KakaoAdfit;
