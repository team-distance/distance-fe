import styled from 'styled-components';

const Title = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-top: 1.5rem;
`;
const WrapImg = styled.img`
  width: 100%;
  padding-top: 1rem;
`;

const Schedule = () => {
  return (
    <>
      <Title>타임테이블</Title>
      <WrapImg src={'/assets/festival/contentsImg/timeTable1.jpg'} />
      <WrapImg src={'/assets/festival/contentsImg/timeTable2.jpg'} />
    </>
  );
};
export default Schedule;
