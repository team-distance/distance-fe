import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import ClipLoader from 'react-spinners/ClipLoader';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [telNum, setTelNum] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [telNumFlag, setTelNumTestFlag] = useState(true);
  const [passwordFlag, setPasswordFlag] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telNum') {
      setTelNumTestFlag(!(value.length === 11));
      setTelNum(value);
    }
    if (name === 'password') {
      setPassword(value);
      setPasswordFlag(value.length < 6);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await instance.post('member/change/password', {
        password: password,
        telNum: telNum,
      });
      navigate('/login');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoaderContainer>
          <ClipLoader color={'#FF625D'} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <WrapForm onSubmit={handleSubmit}>
          <WrapContent>
            <h2>비밀번호 재설정하기</h2>
            <div>
              <TextInput
                label="전화번호"
                name="telNum"
                type="text"
                onChange={handleChange}
                placeholder={"'-'없이 입력"}
              />
            </div>
            <div>
              <TextInput
                label="새 비밀번호"
                name="password"
                type="text"
                onChange={handleChange}
                placeholder={'숫자로만 6자리 이상'}
              />
            </div>
          </WrapContent>
          <Button
            size="large"
            type="submit"
            disabled={telNumFlag || passwordFlag}
          >
            재설정하기
          </Button>
        </WrapForm>
      )}
    </>
  );
};

export default ResetPassword;

const WrapForm = styled.form`
  padding: 2rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  margin-bottom: 8rem;
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
