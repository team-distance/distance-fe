import styled from 'styled-components';
import { useRef, useState } from 'react';
import Button from '../../components/common/Button';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';

const VerifyMobileIdPage = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef();
  const canvasRef = useRef(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsDisabled(false);
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          // 이미지 크기를 조절
          const scaleFactor = 0.3;
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          // 축소된 크기로 이미지 그리기
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // canvas의 내용을 이미지 파일로 변환 (포맷, 품질)
          canvas.toBlob(
            function (blob) {
              console.log('Resized image size:', blob.size);
              setFile(blob);
            },
            'image/jpeg',
            0.5
          );
        };
        img.src = e.target.result; // 파일 리더 결과를 이미지 소스로 설정
      };
      reader.readAsDataURL(file); // 파일을 Data URL로 읽기

      console.log(e.target.files);
      console.log(imageUrl);
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

    try {
      await instance.post('/studentcard/send', formData);
      window.confirm(
        '인증되었습니다. 식별 불가능한 사진일 경우 사용이 제한됩니다.'
      ) && navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WrapContent>
      <h2>'모바일 학생증'으로 인증하기</h2>

      {uploadedImage ? (
        <>
          <UploadedImageDiv
            src={uploadedImage}
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
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </UploadDiv>
      )}
      <Button size={'large'} onClick={sendStudentId} disabled={isDisabled}>
        이미지 전송하기
      </Button>

      <NoticeDiv>
        <h3>모바일 학생증 예시</h3>
        <hr />
        <p>
          전송된 이미지는 학생 인증 용도로만 활용되며 <br />
          학번/이름 등의 민감 정보는 수집되지 않습니다.
        </p>

        <ExamplesContainer>
          <Example>
            <div className="example-image" />
            <img src="/assets/icon-correct.png" alt="correct" />
            <p>학번/이름 식별 가능</p>
          </Example>
          <Example>
            <div className="example-image" />
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
    height: 90px;
    background-color: #d9d9d9;
    border-radius: 10px;
  }
  img {
    padding: 0.5rem 0;
  }
  p {
    margin: 0;
  }
`;
