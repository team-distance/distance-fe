import React from 'react';
import EventListItem from '../../components/event/EventListItem';
import { useRecoilValue } from 'recoil';
import { councilContentsState, schoolState } from '../../store/councilContents';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const EventListPage = () => {
  const school = useRecoilValue(schoolState);
  const contents = useRecoilValue(councilContentsState);
  const navigate = useNavigate();

  return (
    <>
      <UniversityName>{school}</UniversityName>
      <EventListItemWrapper>
        {contents.map((content) => (
          <EventListItem
            key={content.councilId}
            onClick={() => navigate(`/event/${content.councilId}`)}
            councilId={content.councilId}
            title={content.title}
            councilGpsResponses={content.councilGpsResponses}
            councilImageResponses={content.councilImageResponses}
          />
        ))}
      </EventListItemWrapper>
    </>
  );
};

const UniversityName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
  padding: 0 24px;
`;

const EventListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default EventListPage;
