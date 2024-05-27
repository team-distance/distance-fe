import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { instance } from '../../api/instance';
import { UNIV_STATE } from '../../constants/collegeState';

const VerifyOptionsPage = () => {
  const navigate = useNavigate();
  const [authUnivState, setAuthUnivState] = useState('');
  const [university, setUniversity] = useState('');
  const [universityLogo, setUniversityLogo] = useState('');

  const checkVerified = async () => {
    try {
      const authUniv = await instance.get('/member/check/university');
      setAuthUnivState(authUniv.data);
      if (authUniv.data === 'SUCCESS') {
        alert('이미 인증되었어요!');
        navigate('/mypage');
      } else if (authUniv.data === 'PENDING') {
        alert('심사중입니다! 잠시만 기다려주세요.');
        navigate('/mypage');
      }
    } catch (error) {
      console.log(error);
      alert('정보를 불러올 수 없어요. 다시 시도해주세요.');
      navigate('/mypage');
    }
  };

  const fetchSchool = async () => {
    try {
      const res = await instance.get('/univ/check/univ-domain');
      UNIV_STATE.forEach((univ) => {
        if (res.data.join('').includes(univ.id)) {
          setUniversity(univ.name);
          setUniversityLogo(univ.logo);
        }
      });
    } catch (error) {}
  };

  useEffect(() => {
    checkVerified();
    fetchSchool();
  }, []);

  return (
    <WrapContent>
      <h2>
        교내 학생임을 인증해주세요
        <LogoImage src={universityLogo} alt={university} />
      </h2>
      <p>
        세 가지 방법 중 하나를 택해 인증해주세요
        <br />
        인증이 완료되면 불이 들어옵니다.
      </p>

      {authUnivState === 'FAILED_2' && (
        <FailedMessage>사진이 흔들렸습니다!</FailedMessage>
      )}
      {authUnivState === 'FAILED_3' && (
        <FailedMessage>해당 학교 학생증이 아닙니다!</FailedMessage>
      )}
      {authUnivState === 'FAILED_4' && (
        <FailedMessage>
          성별이 다릅니다! 회원 탈퇴 후 다시 가입해주세요.
        </FailedMessage>
      )}
      {authUnivState === 'FAILED_5' && (
        <FailedMessage>
          학과가 다릅니다! 회원 탈퇴 후 다시 가입해주세요.
        </FailedMessage>
      )}
      {authUnivState === 'FAILED_6' && (
        <FailedMessage>사진이 가려져 식별이 불가능합니다!</FailedMessage>
      )}

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
  padding: 5rem 2rem;

  h2 {
    position: relative;
  }

  p {
    margin-top: 0;
    margin-bottom: 3rem;
    font-size: 0.8rem;
  }
`;

const FailedMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  position: absolute;
  bottom: 1rem;
  left: 0;
  z-index: -1;
  width: 30%;
  opacity: 0.2;
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
