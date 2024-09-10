import styled from 'styled-components';

const MatchingSuccess = () => {
  return (
    <WrapContent>
      대화방이 생성되었어요! <br />
      브라우저를 닫고
      <br />
      홈화면에서 distance 앱에 접속해서 대화해보세요!
    </WrapContent>
  );
};

export default MatchingSuccess;

const WrapContent = styled.p`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: normal;
`;
