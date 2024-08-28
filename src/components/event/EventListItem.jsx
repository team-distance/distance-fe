import React from 'react';
import styled from 'styled-components';

const EventListItem = ({
  onClick,
  title,
  councilGpsResponses,
  councilImageResponses,
}) => {
  return (
    <div onClick={onClick}>
      <PostTitle>{title}</PostTitle>
      <Locations>
        위치:{' '}
        {councilGpsResponses.map((gpsResponse, index) => (
          <span key={index}>{gpsResponse.location} </span>
        ))}
      </Locations>
      <ImageContainer>
        {councilImageResponses.map((imageResponse, index) => (
          <WrapImage key={index}>
            <Image src={imageResponse.imageUrl} alt="이미지" />
          </WrapImage>
        ))}
      </ImageContainer>
    </div>
  );
};

const PostTitle = styled.h2`
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  padding: 0 24px;
`;

const Locations = styled.p`
  font-size: 12px;
  font-style: normal;
  font-weight: 200;
  line-height: 22px;
  padding: 0 24px;
`;

const ImageContainer = styled.div`
  display: flex;
  overflow: scroll;
  gap: 8px;
  padding: 0 24px;
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

export default EventListItem;
