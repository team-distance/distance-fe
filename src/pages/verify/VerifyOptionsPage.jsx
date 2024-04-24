import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { instance } from '../../api/instance';

const VerifyOptionsPage = () => {
  const navigate = useNavigate();

  const checkVerified = async () => {
    try {
      const authUniv = await instance.get('/member/check/university');
      if (authUniv.data === 'SUCCESS') {
        alert('이미 인증되었어요!');
        navigate('/mypage');
      }
    } catch (error) {
      console.log(error);
      alert('정보를 불러올 수 없어요. 다시 시도해주세요.');
      navigate('/mypage');
    }
  };

  useEffect(() => {
    checkVerified();
  }, []);

  return (
    <WrapContent>
      <LogoImage src="/assets/univ-logo.png" alt="logo image" />
      <h2>교내 학생임을 인증해주세요</h2>
      <p>
        세 가지 방법 중 하나를 택해 인증해주세요
        <br />
        인증이 완료되면 불이 들어옵니다.
      </p>

      <WrapButton>
        <ButtonDiv
          onClick={() => {
            navigate('/verify/univ/mobileid');
          }}
        >
          모바일 학생증
        </ButtonDiv>
        <ButtonDiv
          onClick={() => {
            navigate('/verify/univ/email');
          }}
        >
          학생 메일
        </ButtonDiv>
        <ButtonDiv
          onClick={() => {
            navigate('/verify/univ/id');
          }}
        >
          학생증
        </ButtonDiv>
      </WrapButton>
    </WrapContent>
  );
};
export default VerifyOptionsPage;

const WrapContent = styled.div`
  display: grid;
  padding: 4rem 2rem;

  h2 {
    position: relative;
  }
  p {
    margin-top: 0;
    margin-bottom: 3rem;
    font-size: 0.8rem;
  }
`;

const LogoImage = styled.img`
  position: absolute;
  top: 3rem;
  z-index: -1;
  width: 40%;
`;

const WrapButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 21px 16px;
  border-radius: 10px;
  border: 1px solid rgba(211, 211, 211, 0.5);
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
`;
