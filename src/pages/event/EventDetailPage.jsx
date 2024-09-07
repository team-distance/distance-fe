import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../api/instance';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { schoolState } from '../../store/councilContents';
import { selectedMarkerGps } from '../../store/selectedMarkerGps';
import { ClipLoader } from 'react-spinners';

const EventDetailPage = () => {
  const school = useRecoilValue(schoolState);
  const [selectedGpsCoord, setSelectedGpsCoord] =
    useRecoilState(selectedMarkerGps);
  const [content, setContent] = useState({});
  const { studentCouncilId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const fetchCouncilDetail = async () => {
    try {
      const response = await instance.get(`/council/${studentCouncilId}`);
      setContent(response.data);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCouncilDetail();
  }, [studentCouncilId]);

  useEffect(() => {
    if (!selectedGpsCoord.latitude && !selectedGpsCoord.longitude) {
      if (content.councilGpsResponses?.length) {
        setSelectedGpsCoord({
          latitude: content.councilGpsResponses[0]?.councilLatitude,
          longitude: content.councilGpsResponses[0]?.councilLongitude,
        });
      }
    }
  }, [selectedGpsCoord]);

  return (
    <Wrapper>
      {isLoading && (
        <Loader>
          <ClipLoader loading={isLoading} color="#FF6B6B" size={50} />
        </Loader>
      )}
      <TitleSection>
        <BackButton
          src="/assets/arrow-pink-button.png"
          alt="뒤로가기"
          onClick={() => navigate(`/event?school=${school}`)}
        />
        <Title>{content.title}</Title>
        <Stroke />
      </TitleSection>

      <Location>
        위치:{' '}
        {content.councilGpsResponses
          ?.map((gpsResponse) => gpsResponse.location)
          .join(', ')}
      </Location>

      <Date>
        날짜: {content.startDt} ~ {content.endDt}
      </Date>

      <ImageContainer>
        {content.councilImageResponses?.map((image, index) => (
          <img src={image.imageUrl} alt={content.title} key={index} />
        ))}
      </ImageContainer>

      <Content>{content.content}</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
`;

const BackButton = styled.img`
  width: 16px;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 22px;
  flex-shrink: 0;
`;

const Stroke = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 9999px;
  background-color: #ededed;
`;

const Location = styled.div`
  font-size: 0.75rem;
  font-weight: 200;
  line-height: 22px;
  padding: 0 24px;
  margin-top: 16px;
`;

const Date = styled.div`
  font-size: 0.75rem;
  font-weight: 200;
  line-height: 22px;
  padding: 0 24px;
`;

const ImageContainer = styled.div`
  display: flex;
  overflow: auto;
  gap: 4px;
  padding: 0 1.5rem;
  flex-shrink: 0;

  img {
    width: 160px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }
`;

const Content = styled.p`
  font-size: 12px;
  font-weight: 200;
  line-height: 22px;
  padding: 16px 24px;
  overflow: auto;
`;

export default EventDetailPage;
