import styled from 'styled-components';
import { useRef, useState } from 'react';
import Button from '../../components/common/Button';
import { authInstance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';

const VerifyMobileIdPage = () => {

  const navigate = useNavigate();

  const fileInputRef = useRef();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);

  const onChangeImage = e => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setFile(file);
    setUploadedImage(imageUrl);
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
      await authInstance.post('/studentcard/send',formData);
      window.confirm("인증되었습니다. 식별 불가능한 사진일 경우 사용이 제한됩니다.") && navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <WrapContent>
      <h2>'모바일 학생증'으로 인증하기</h2>

      {uploadedImage ? (
        <>
          <UploadedImageDiv
            src={uploadedImage}
            alt="profile"
            onClick={handleButtonClick} />
          <input
            ref={fileInputRef}
            type="file"
            onChange={onChangeImage}
            hidden />
        </>
      ) : (
        <UploadDiv onClick={handleButtonClick}>
          <img src="/assets/camera.png" alt="no profile" />
          <p>이미지 업로드</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={onChangeImage}
            hidden />
        </UploadDiv>
      )}
      <Button
        size={"medium"}
        onClick={sendStudentId}>
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
  )
}

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
`;

const UploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 185px;
  border-radius: 20px;
  border: 2px dashed #FF625D;

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
    margin:0;
  }
  hr {
    width: 80%;
    margin-left: 0;
    border: 0.1px solid #D3D3D3;
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
    background-color: #D9D9D9;
    border-radius: 10px;
  }
  img {
    padding: 0.5rem 0;
  }
  p {
    margin:0;
  }
`;