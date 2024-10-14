import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { ClipLoader } from 'react-spinners';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scaleImage } from '../../utils/scaleImage';
import { useToast } from '../../hooks/useToast';

const VerifyMobileIdPage = () => {
  const [file, setFile] = useState(null);
  const [schoolId, setSchoolId] = useState('');

  const fileInputRef = useRef();

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => instance.post('/studentcard/send', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUniv'] });
      alert('인증되었습니다. 식별 불가능한 사진일 경우 사용이 제한됩니다.');
      navigate('/');
    },
    onError: (error) => {
      alert('학생증 전송에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { showToast: showFileErrorToast } = useToast(
    () => <span>이미지를 올리는데 실패했습니다. 다시 시도해주세요.</span>,
    'my-data-error',
    'bottom-center'
  );

  const onChangeImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      try {
        const scaledImage = await scaleImage(file, 0.3, 'image/jpeg', 0.7);
        setFile(scaledImage);
      } catch (error) {
        showFileErrorToast();
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const sendStudentId = async () => {
    if (!file) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('studentcard', file);

    mutation.mutate(formData);
  };

  useEffect(() => {
    const getDomain = async () => {
      try {
        const res = await instance.get('/univ/check/univ-domain');
        let domain = res.data[0].replace('@', '');
        setSchoolId(
          domain.startsWith('chonnam') ? 'jnu' : domain.split('.')[0]
        );
      } catch (error) {
        console.log(error);
      }
    };

    getDomain();
  }, []);

  return (
    <WrapContent>
      <Heading2>'학생증'으로 인증하기</Heading2>

      {file ? (
        <>
          <UploadedImageDiv
            src={URL.createObjectURL(file)}
            alt="profile"
            onClick={handleButtonClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onChangeImage}
            hidden
          />
        </>
      ) : (
        <UploadDiv onClick={handleButtonClick}>
          <img src="/assets/camera.png" alt="no profile" />
          <p>이미지 업로드</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onChangeImage}
            hidden
          />
        </UploadDiv>
      )}

      <Button
        size={'large'}
        onClick={sendStudentId}
        disabled={!file || mutation.isPending}
      >
        {mutation.isPending ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
            }}
          >
            <ClipLoader color={'#fff'} loading={true} size={16} />
            <div>전송 중...</div>
          </div>
        ) : (
          <div>이미지 전송하기</div>
        )}
      </Button>

      <NoticeDiv>
        <Heading3>흔들린 사진은 심사가 어려워요!</Heading3>
        <hr />
        <p>
          전송된 이미지는 학생 인증 용도로만 활용되며 <br />
          학번/이름 등의 민감 정보는 수집되지 않습니다.
        </p>

        <ExamplesContainer>
          <Example>
            <div className="example-image">
              <img
                src={`/assets/id-examples/id1-${schoolId}.png`}
                alt="학생증 예시1"
              />
            </div>
            <img src="/assets/icon-correct.png" alt="correct" />
            <p>학번/이름 식별 가능</p>
          </Example>
          <Example>
            <div className="example-image">
              <img
                src={`/assets/id-examples/id2-${schoolId}.png`}
                alt="학생증 예시2"
              />
            </div>
            <img src="/assets/icon-wrong.png" alt="wrong" />
            <p>학번/이름 식별 불가능</p>
          </Example>
        </ExamplesContainer>
      </NoticeDiv>
    </WrapContent>
  );
};

export default VerifyMobileIdPage;

const WrapContent = styled.div`
  display: grid;
  gap: 1rem;
  padding: 4rem 2rem 4rem 2rem;
`;

const Heading2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Heading3 = styled.h3`
  font-weight: 700;
`;

const UploadedImageDiv = styled.img`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 185px;
  border-radius: 20px;
  object-fit: cover;
`;

const UploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 185px;
  border-radius: 20px;
  border: 2px dashed #ff625d;
  box-sizing: border-box;

  img {
    width: 20%;
  }
  p {
    font-weight: 300;
    padding-top: 1rem;
    margin: 0;
  }
`;

const NoticeDiv = styled.div`
  border-radius: 20px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.08);
  margin-top: 10%;
  padding: 2rem 1.5rem;

  h3 {
    margin: 0;
  }
  hr {
    width: 80%;
    margin-left: 0;
    border: 0.1px solid #d3d3d3;
  }
  p {
    color: #333333;
    font-size: 0.7rem;
    font-weight: 200;
    margin: 0 0 2rem 0;
  }
`;

const ExamplesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2rem;
`;

const Example = styled.div`
  flex: 1;

  .example-image {
    padding: 0.3rem;
    background-color: #d9d9d9;
    border-radius: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  img {
    padding: 0.5rem 0;
  }

  p {
    margin: 0;
  }
`;
