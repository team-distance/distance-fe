import React from 'react';
import { HOBBY } from '../../constants/profile';
import styled from 'styled-components';
import useErrorToast from '../../hooks/useErrorToast';

const HobbyModal = ({ closeModal, selectedList, hashtagCount, onClick }) => {

  // 토스트 에러메세지 - 해시태그 5개 이상 선택
  const {showToast: showFullHashTagToast} = useErrorToast(
    () => <span>
      해시태그는 5개까지만 선택 가능해요!
    </span>, 'hashtag-limit'
  )
  // 토스트 에러메세지 - 이미 선택한 해시태그
  const {showToast: showSelectedHashTagToast} = useErrorToast(
    () => <span>
      이미 선택한 해시태그에요!
    </span>, 'hashtag-selected'
  )

  return (
    <Modal>
      <Title>
        <div>취미 선택하기</div>
        <img
          src="/assets/cancel-button.png"
          alt="닫기 버튼"
          onClick={closeModal}
        />
      </Title>
      <Body>
        {HOBBY.map((value) => (
          <ListItem
            key={value}
            onClick={() => {
              if (hashtagCount >= 5) {
                showFullHashTagToast();
                return;
              } else if (selectedList.includes(value)) {
                showSelectedHashTagToast();
                return;
              }
              onClick([...selectedList, value]);
              closeModal();
            }}
            color={selectedList.includes(value) ? '#FF625D' : 'black'}
          >
            {value}
          </ListItem>
        ))}
      </Body>
    </Modal>
  );
};

export default HobbyModal;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 327px;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 10px #3333334d;
  z-index: 100;
  overflow: hidden;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #ff625d;
  color: white;
  font-size: 18px;
  padding: 22px 28px;
  font-weight: 700;
`;

const Body = styled.div`
  max-height: 256px;
  overflow: auto;
  margin-top: 0.5rem;
`;

const ListItem = styled.div`
  color: ${(props) => props.color};
  padding: 0.5rem 1.3rem;
`;
