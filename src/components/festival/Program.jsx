import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProgramCard from './ProgramCard';

const Title = styled.div`
  font-size: 36px;
  font-weight: 700;
`;
const Date = styled.div`
  font-size: 1rem;
  font-weight: 600;
  padding: 1.5rem 0;
`;
const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Program = () => {
  const content = [
    {
      title: '개회식',
      img: '/assets/festival/contentsImg/opening.jpeg',
      date: '2024.03.24 (토) 14:00',
      place: '카카오 AI 캠퍼스 1층 그로잉 홀',
    },
    {
      title: '야식제공',
      img: '/assets/festival/contentsImg/chicken.jpeg',
      date: '2024.03.24 (일) 01:00~02:00',
      place: '카카오 AI 캠퍼스 1층 그로잉 홀',
    },
    {
      title: '시상식 및 럭키드로우',
      img: '/assets/festival/contentsImg/awards.jpeg',
      date: '2024.03.24(일) 07:00~09:10',
      place: '카카오 AI 캠퍼스 1층 그로잉 홀',
    },
    {
      title: '데모부스',
      img: '/assets/festival/contentsImg/demobooth.jpeg',
      date: '2024.03.24(일) 16:30~17:00',
      place: '카카오 AI 캠퍼스 1층 그로잉 홀',
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <Title>구름대학교</Title>
      <Date>3월 23일</Date>
      <WrapCards>
        <ProgramCard
          onClick={() => navigate('/festival/detail/0')}
          content={content[0]}
        />
        <ProgramCard
          onClick={() => navigate('/festival/detail/1')}
          content={content[1]}
        />
      </WrapCards>
      <Date className="cardsDate">3월 24일</Date>
      <WrapCards>
        <ProgramCard
          onClick={() => navigate('/festival/detail/2')}
          content={content[2]}
        />
        <ProgramCard
          onClick={() => navigate('/festival/detail/3')}
          content={content[3]}
        />
      </WrapCards>
    </>
  );
};
export default Program;
