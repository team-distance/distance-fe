import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderPrev = ({ title, navigateTo, text }) => {
  const navigate = useNavigate();

  return (
    <WrapHeader>
      <TitleContainer>
        <img
          src="/assets/arrow-pink-button.png"
          alt="Go Back"
          onClick={() => navigate(navigateTo)}
        />
        <Title>{title}</Title>
      </TitleContainer>
      <Text>{text}</Text>
    </WrapHeader>
  );
};

const WrapHeader = styled.header`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;

  img {
    max-width: 1rem;
    object-fit: contain;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.5rem;
`;

const Text = styled.p`
  margin-top: 0.5rem;
`;

export default HeaderPrev;
