import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Menu = ({
    isOpen,
    setIsOpen,
    handleReport,
    handleLeave,
    file,
    setFile,
    setUploadedImage,
    isFirstRender
}) => {
    const fileInputRef = useRef();
    const canvasRef = useRef(null);

    const handleImageButtonClick = () => {
        fileInputRef.current.click();
    };

    const onChangeImage = (e) => {
        console.log("onChange>>>>>>>" , e.target.value);
        const inputFile = e.target.files[0];

        if (inputFile) {
            if (!inputFile.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }

            const imageUrl = URL.createObjectURL(inputFile);
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
            reader.readAsDataURL(inputFile); // 파일을 Data URL로 읽기
        }
    };

    useEffect(() => {
        fileInputRef.current.value = "";
    },[file])

    return (
        <>
            <NavContainer className="menu" $isOpen={isOpen} $isFirstRender={isFirstRender}>
                <WrapMenu>
                    <li onClick={handleImageButtonClick}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onChangeImage}
                            hidden
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
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
            {isOpen && <BlurBackground className="background" onClick={() => setIsOpen(false)} />}
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
    rgba(255, 255, 255, 0) 20%, /* 투명한 부분이 20% 지점까지 */
    rgba(255, 255, 255, 0.7) 50%, /* 그라데이션 시작 */
    rgba(255, 255, 255, 1) 70% /* 아래쪽은 진한 흰색 */
  );
  backdrop-filter: blur(1px);
  z-index: -2;
`;

const NavContainer = styled.nav`
  position: relative;
  z-index: ${({ $isOpen }) => ($isOpen ? '1' : '-1')};
  visibility: ${({$isFirstRender}) => ($isFirstRender ? "hidden" : "visible")}
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
