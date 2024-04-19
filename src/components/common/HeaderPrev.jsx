import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const WrapHeader = styled.header`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;

  p,
  h2 {
    margin: 0;
  }
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
        <h2>{title}</h2>
      </TitleContainer>
      <p className="text">{text}</p>
    </WrapHeader>
  );
};

export default HeaderPrev;
