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
import ExpandableBottomsheet from '../../components/event/ExpandableBottomsheet';
import FloatingInput from '../../components/event/FloatingInput';

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

      setSchool(response.data?.school);
      setContents(response.data?.contentResponse);
      setSchoolLocation({
        latitude: response.data?.schoolLocation?.latitude,
        longitude: response.data?.schoolLocation?.longitude,
      });
    } catch (e) {
      console.error('ERROR!!', e);
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
      contents?.forEach((content) => {
        content.councilGpsResponses.forEach((gpsResponse) => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              gpsResponse.councilLatitude,
              gpsResponse.councilLongitude
            ),
            map: mapRef.current,
            icon: {
              content: [
                '<div style="position: relative; display: flex; flex-direction: column; gap: 4px;">',
                `<div style="border-radius: 4px; font-size: 8px; color: white; background-color: #333333; padding: 4px; display: flex; items-align: center; gap: 6px; white-space: nowrap;">${content.title}`,
                '</div>',
                '<div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-width: 4px 2px 0px 2px; border-color: #333333 transparent transparent transparent;"></div>',
                '<div style="text-align: center;">',
                '<img src="/assets/event/marker.svg" alt="marker" />',
                '</div>',
                '</div>',
              ].join(''),
              anchor: new naver.maps.Point(15, 35),
            },
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
      <FloatingInput
        onSubmit={handleSubmit}
        onChange={handleChangeSchoolQuery}
      />

      <NaverMap ref={mapElement} />

      <ExpandableBottomsheet>
        <Outlet />
      </ExpandableBottomsheet>
    </Wrapper>
  );
};

export default EventIndexPage;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100dvh;
`;

const NaverMap = styled.div`
  width: 100%;
  height: 55%;
`;
