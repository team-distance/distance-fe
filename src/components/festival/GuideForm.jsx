import React from 'react';
import styled from 'styled-components';

const WrapForm = styled.div`
  padding: 2rem 0 2rem 1rem;
`;
const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.6rem;
`;
const CardDiv = styled.div`
  display: flex;
  overflow: auto;
  white-space: nowrap;
  gap: 0.5rem;
  padding: 1rem 0;

  img {
    width: 250px;
    height: 250px;
  }
`;
const TextDiv = styled.div`
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const GuideForm = ({ content }) => {
  return (
    <WrapForm>
      <Title>{content.title}</Title>
      <CardDiv>
        {content.img.map((image, index) => (
          <img key={index} src={image} alt="Card" />
        ))}
      </CardDiv>
      <TextDiv>{content.context}</TextDiv>
    </WrapForm>
  );
};

export default GuideForm;
