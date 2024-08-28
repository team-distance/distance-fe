import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instance } from '../../api/instance';
import styled from 'styled-components';

const EventDetailPage = () => {
  const [content, setContent] = useState({});
  const { studentCouncilId } = useParams();
  const navigate = useNavigate();

  const fetchCouncilDetail = async () => {
    try {
      const response = await instance.get(`/council/${studentCouncilId}`);
      setContent(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCouncilDetail();
  }, []);

  return (
    <Wrapper>
      <TitleSection>
        <BackButton
          src="/assets/arrow-pink-button.png"
          alt="뒤로가기"
          onClick={() => navigate(-1)}
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
  padding: 0 24px;
  height: 50%;
  overflow: auto;
`;

export default EventDetailPage;
