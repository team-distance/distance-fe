import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  councilContentsState,
  schoolQueryState,
  schoolState,
} from '../../store/councilContents';
import { selectedMarkerGps } from '../../store/selectedMarkerGps';
import Bottomsheet from '../../components/event/Bottomsheet';

const EventIndexPage = () => {
  const [schoolLocation, setSchoolLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [contents, setContents] = useRecoilState(councilContentsState);
  const [selectedMarker, setSelectedMarker] = useRecoilState(selectedMarkerGps);
  const resetSelectedGpsCoord = useResetRecoilState(selectedMarkerGps);
  const [schoolQuery, setSchoolQuery] = useRecoilState(schoolQueryState);
  const setSchool = useSetRecoilState(schoolState);

  const [searchParams] = useSearchParams();
  const { studentCouncilId } = useParams();

  const mapRef = useRef(null);
  const mapElement = useRef(null);
  const { naver } = window;

  const navigate = useNavigate();

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
    } catch (e) {
      alert('데이터를 가져오는데 실패했습니다');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    resetSelectedGpsCoord();
    navigate(`/event?school=${schoolQuery}`);
    fetchContents(schoolQuery || null);
  };

  const handleChangeSchoolQuery = (e) => {
    setSchoolQuery(e.target.value);
  };

  useEffect(() => {
    const school = searchParams.get('school');

    if (!studentCouncilId) {
      fetchContents(school || null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!naver) return;

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapElement.current, {
        zoom: 15,
        disableKineticPan: false,
        mapDataControl: false,
        scaleControl: false,
        logoControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
      });
    } else {
      mapRef.current.morph(
        new naver.maps.LatLng(schoolLocation.latitude, schoolLocation.longitude)
      );
    }
  }, [schoolLocation]);

  useEffect(() => {
    if (studentCouncilId) {
      mapRef.current.morph(
        new naver.maps.LatLng(selectedMarker.latitude, selectedMarker.longitude)
      );
    }
  }, [studentCouncilId, selectedMarker]);

  useEffect(() => {
    if (mapRef.current) {
      contents.forEach((content) => {
        content.councilGpsResponses.forEach((gpsResponse) => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              gpsResponse.councilLatitude,
              gpsResponse.councilLongitude
            ),
            map: mapRef.current,
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedMarker({
              latitude: gpsResponse.councilLatitude,
              longitude: gpsResponse.councilLongitude,
            });

            navigate(`/event/${content.councilId}`);
          });
        });
      });
    }
  }, [contents]);

  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit}>
        <FloatingInput
          placeholder="학교명을 입력해주세요"
          onChange={handleChangeSchoolQuery}
        />
        <SearchButton type="submit">
          <img src="/assets/search-button.svg" alt="search" />
        </SearchButton>
      </StyledForm>

      <div ref={mapElement} style={{ width: '100%', height: '55%' }} />

      <Bottomsheet>
        <Outlet />
      </Bottomsheet>
    </Wrapper>
  );
};

export default EventIndexPage;

const Wrapper = styled.div`
  position: relative;
  height: 100dvh;
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
