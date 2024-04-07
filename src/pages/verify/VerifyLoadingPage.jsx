import styled from 'styled-components';

const VerifyLoadingPage = () => {

  return (
    <WrapContent>
      <h2>
        심사가 완료되면 <br />
        3분 내에 알려드릴게요
      </h2>

    </WrapContent>
  )
}

export default VerifyLoadingPage;

const WrapContent = styled.div`
  display: grid;
  gap: 1rem;
  padding: 4rem 2rem 4rem 2rem;
`;