import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { scaleImage } from '../../utils/scaleImage';
import { motion } from 'framer-motion';

const backgroundVariants = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const menuVariants = {
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ease: [0.2, 0.8, 0.2, 1], duration: 0.6 },
  },
  hidden: {
    opacity: 0,
    y: 100,
    filter: 'blur(10px)',
    transition: { ease: [0.2, 0.8, 0.2, 1], duration: 0.6 },
  },
};

const Menu = ({ setIsOpen, handleReport, handleLeave, file, setFile }) => {
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
    <BlurBackground
      onClick={() => setIsOpen(false)}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backgroundVariants}
    >
      <WrapMenu>
        <motion.li onClick={handleImageButtonClick} variants={menuVariants}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onChangeImage}
            hidden
          />
          <img src="/assets/chat/picture-icon.svg" alt="사진 전송" />
          사진 전송
        </motion.li>
        <motion.li onClick={handleReport} variants={menuVariants}>
          <img src="/assets/chat/report-icon.svg" alt="신고하기" />
          신고하기
        </motion.li>
        <motion.li onClick={handleLeave} variants={menuVariants}>
          <img src="/assets/chat/leave-icon.svg" alt="나가기" />
          나가기
        </motion.li>
      </WrapMenu>
    </BlurBackground>
  );
};
export default Menu;

const BlurBackground = styled(motion.div)`
  position: absolute;
  height: calc(100vh - 100%);
  left: 0;
  right: 0;
  bottom: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 20%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 1) 70%
      /* 투명한 부분이 20% 지점까지, 그라데이션 시작, 아래쪽은 진한 회색 */
  );
  backdrop-filter: blur(1px);
  z-index: -1;
`;

const WrapMenu = styled.ul`
  position: absolute;
  bottom: 0;

  li {
    display: flex;
    align-items: center;
    font-weight: 200;
    padding: 0.7rem 0 0.7rem 1rem;

    img {
      padding-right: 1rem;
    }
  }
`;
