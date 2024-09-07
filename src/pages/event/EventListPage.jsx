import React from 'react';
import EventListItem from '../../components/event/EventListItem';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { councilContentsState, schoolState } from '../../store/councilContents';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { selectedMarkerGps } from '../../store/selectedMarkerGps';

const EventListPage = () => {
  const school = useRecoilValue(schoolState);
  const contents = useRecoilValue(councilContentsState);
  const navigate = useNavigate();
  const setSelectedGpsCoord = useSetRecoilState(selectedMarkerGps);

  return (
    <Wrapper>
      <UniversityName>{school}</UniversityName>
      <EventListItemWrapper>
        {contents.length ? (
          contents.map((content) => (
            <EventListItem
              key={content.councilId}
              onClick={() => {
                setSelectedGpsCoord({
                  latitude: content.councilGpsResponses[0]?.councilLatitude,
                  longitude: content.councilGpsResponses[0]?.councilLongitude,
                });

                navigate(`/event/${content.councilId}`);
              }}
              councilId={content.councilId}
              title={content.title}
              councilGpsResponses={content.councilGpsResponses}
              councilImageResponses={content.councilImageResponses}
            />
          ))
        ) : (
          <EmptyFallback>아직 등록된 글이 없어요!</EmptyFallback>
        )}
      </EventListItemWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const UniversityName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  padding: 0 24px;
  margin-bottom: 16px;
`;

const EmptyFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 14px;
  color: #999;
`;

const EventListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
  padding: 16px 0;
`;

export default EventListPage;
