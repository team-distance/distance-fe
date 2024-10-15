import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { scaleImage } from '../../utils/scaleImage';

const Menu = ({
  isOpen,
  setIsOpen,
  handleReport,
  handleLeave,
  file,
  setFile,
  isFirstRender,
}) => {
  const fileInputRef = useRef();

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // HEIC 이미지는 JPEG로 변환
  const onChangeImage = async (e) => {
    const inputFile = e.target.files[0];

    if (inputFile) {
      if (inputFile.type.startsWith('image/heic')) {
        try {
          const scaledImage = await scaleImage(inputFile, 1, 'image/jpeg', 1);
          setFile(scaledImage);
        } catch (error) {
          console.log(error);
        }
      } else {
        setFile(inputFile);
      }
    }
  };

  useEffect(() => {
    fileInputRef.current.value = '';
  }, [file]);

  return (
    <>
      <NavContainer
        className="menu"
        $isOpen={isOpen}
        $isFirstRender={isFirstRender}
      >
        <WrapMenu>
          <li onClick={handleImageButtonClick}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onChangeImage}
              hidden
            />
            <img src="/assets/chat/picture-icon.svg" alt="사진 전송" />
            사진 전송
          </li>
          <li onClick={handleReport}>
            <img src="/assets/chat/report-icon.svg" alt="신고하기" />
            신고하기
          </li>
          <li onClick={handleLeave}>
            <img src="/assets/chat/leave-icon.svg" alt="나가기" />
            나가기
          </li>
        </WrapMenu>
      </NavContainer>
      {isOpen && (
        <BlurBackground
          className="background"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
export default Menu;

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 20%,
    /* 투명한 부분이 20% 지점까지 */ rgba(255, 255, 255, 0.7) 50%,
    /* 그라데이션 시작 */ rgba(255, 255, 255, 1) 70% /* 아래쪽은 진한 흰색 */
  );
  backdrop-filter: blur(1px);
  z-index: -2;
`;

const NavContainer = styled.nav`
  position: relative;
  visibility: ${({ $isFirstRender }) =>
    $isFirstRender ? 'hidden' : 'visible'};
`;

const WrapMenu = styled.ul`
  padding: 0.5rem 0;

  li {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 200;
    padding: 0.7rem 0 0.7rem 1rem;

    img {
      padding-right: 1rem;
    }
  }
`;
