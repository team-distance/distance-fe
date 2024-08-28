import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { councilContentsState, schoolState } from '../../store/councilContents';

const EventIndexPage = () => {
  const [contents, setContents] = useRecoilState(councilContentsState);
  const setSchool = useSetRecoilState(schoolState);

  const [schoolLocation, setSchoolLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [schoolQuery, setSchoolQuery] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const [map, setMap] = useState(null);
  const mapElement = useRef(null);
  const { naver } = window;

  const navigate = useNavigate();

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

  const fetchContents = async (school) => {
    try {
      const response = await instance.get('/council', {
        params: {
          school: school,
        },
      });

      setSchool(response.data.school);
      setContents(response.data.contentResponse);
      setSchoolLocation({
        latitude: response.data.schoolLocation.latitude,
        longitude: response.data.schoolLocation.longitude,
      });

      console.log(response.data);
    } catch (e) {
      alert('데이터를 가져오는데 실패했습니다');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate('/event');
    setSearchParams({ school: schoolQuery });

    fetchContents(schoolQuery || null);
  };

  const handleChangeSchoolQuery = (e) => {
    setSchoolQuery(e.target.value);
  };

  useEffect(() => {
    const school = searchParams.get('school');
    fetchContents(school || null);
  }, [searchParams]);

  useEffect(() => {
    const map = new naver.maps.Map(mapElement.current, {
      center: new naver.maps.LatLng(
        schoolLocation.latitude,
        schoolLocation.longitude
      ),
      zoom: 15,
      disableKineticPan: false,
      mapDataControl: false,
      scaleControl: false,
      logoControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

    setMap(map);
  }, []);

  useEffect(() => {
    if (map) {
      map.morph(
        new naver.maps.LatLng(schoolLocation.latitude, schoolLocation.longitude)
      );
    }
  }, [schoolLocation]);

  useEffect(() => {
    if (map) {
      contents.forEach((content) => {
        content.councilGpsResponses.forEach((gpsResponse) => {
          new naver.maps.Marker({
            position: new naver.maps.LatLng(
              gpsResponse.councilLatitude,
              gpsResponse.councilLongitude
            ),
            map: map,
          });
        });
      });
    }
  }, [contents]);

  return (
    <Wrapper onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
      <StyledForm onSubmit={handleSubmit}>
        <FloatingInput
          placeholder="학교명을 입력해주세요"
          onChange={handleChangeSchoolQuery}
        />
        <SearchButton type="submit">
          <img src="/assets/search-button.svg" alt="search" />
        </SearchButton>
      </StyledForm>

      <div ref={mapElement} style={{ width: '100%', height: '55%' }}></div>

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
          <Outlet />
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
  outline: none;
  opacity: 0.8;

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
  height: 100%;
`;
