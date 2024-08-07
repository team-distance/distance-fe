import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from 'react-naver-maps';

const EventIndexPage = () => {
  const [contents, setContents] = useState([]);
  const navermaps = useNavermaps();

  const [isDragging, setIsDragging] = useState(false);
  const [yPosition, setYPosition] = useState(window.innerHeight / 2);
  const [animatedYPosition, setAnimatedYPosition] = useState(
    window.innerHeight / 2
  );

  const handleTouchStart = (e) => {
    const rect = e.target.getBoundingClientRect();
    setYPosition(rect.top);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const y = e.touches[0].clientY;
    if (y >= 100 && y <= window.innerHeight / 2) setYPosition(y);
  };

  const handleTouchEnd = () => {
    if (
      Math.abs(100 - yPosition) < Math.abs(window.innerHeight / 2 - yPosition)
    ) {
      setAnimatedYPosition(100);
      setYPosition(100);
    } else {
      setAnimatedYPosition(window.innerHeight / 2);
      setYPosition(window.innerHeight / 2);
    }
    setIsDragging(false);
  };

  const fetchContents = async () => {
    try {
      const response = await instance.get('/council');
      console.log(response.data);
      setContents(response.data);
    } catch (e) {
      alert('데이터를 가져오는데 실패했습니다');
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return (
    <Wrapper onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
      <StyledForm>
        <FloatingInput placeholder="학교명을 입력해주세요" />
        <SearchButton type="submit">
          <img src="/assets/search-button.svg" alt="search" />
        </SearchButton>
      </StyledForm>

      <MapDiv style={{ width: '100%', height: '55%' }}>
        <NaverMap
          logoControlOptions={{ position: navermaps.Position.TOP_RIGHT }}
          mapDataControl={false}
          scaleControl={false}
          defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
          defaultZoom={15}
        >
          {contents.map((content) =>
            content.councilGpsResponses.map((gpsResponse) => (
              <Marker
                key={content.id}
                position={
                  new navermaps.LatLng(
                    gpsResponse.councilLatitude,
                    gpsResponse.councilLongitude
                  )
                }
              />
            ))
          )}
        </NaverMap>
      </MapDiv>

      <Bottomsheet
        style={{
          top: `${isDragging ? yPosition : animatedYPosition}px`,
        }}
        $isDragging={isDragging}
      >
        <HandleArea onTouchStart={handleTouchStart}>
          <Handle />
        </HandleArea>
        <Body>
          <UniversityName>전남대학교</UniversityName>
          {contents.map((content) => (
            <div key={content.id}>
              <PostTitle>{content.content}</PostTitle>
              <Locations>
                위치:{' '}
                {content.councilGpsResponses.map((gpsResponse) => (
                  <span>{gpsResponse.location} </span>
                ))}
              </Locations>
              <ImageContainer>
                {content.councilImageResponses.map((imageResponse) => (
                  <WrapImage>
                    <Image src={imageResponse.imageUrl} alt="이미지" />
                  </WrapImage>
                ))}
              </ImageContainer>
            </div>
          ))}
        </Body>
      </Bottomsheet>
    </Wrapper>
  );
};

export default EventIndexPage;

const Wrapper = styled.div`
  width: 100dvw;
  height: 100dvh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const StyledForm = styled.form`
  position: absolute;
  top: 16px;
  left: 50%;
  width: 75%;
  transform: translateX(-50%);
  z-index: 1;
`;

const FloatingInput = styled.input`
  width: 100%;
  z-index: 1;
  padding: 10px 16px;
  font-size: 14px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  border: none;
  box-sizing: border-box;

  &::placeholder {
    color: #d3d3d3;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    width: 20px;
    height: 20px;
  }
`;

const Bottomsheet = styled.div`
  width: 100%;
  height: 744px;
  touch-action: none; // 터치되었을 때 뒷 배경 스크롤 막기
  background-color: white;
  border-radius: 25px 25px 0 0;
  position: absolute;
  transition: ${(props) => !props.$isDragging && 'top 0.25s ease-out'};
`;

const HandleArea = styled.div`
  width: 100%;
  padding-top: 8px;
  padding-bottom: 44px;
`;

const Handle = styled.div`
  width: 84px;
  height: 4px;
  background-color: #d3d3d3;
  border-radius: 9999px;
  margin: 0 auto;
`;

const Body = styled.div`
  padding: 16px;
`;

const UniversityName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
`;

const PostTitle = styled.h2`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
`;

const Locations = styled.p`
  font-size: 12px;
  font-style: normal;
  font-weight: 200;
  line-height: 22px;
`;

const ImageContainer = styled.div`
  display: flex;
  margin-top: 16px;
  overflow: scroll;
  gap: 8px;
`;

const WrapImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(50, 50);
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: auto;
`;
