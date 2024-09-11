import React from 'react';
import styled from 'styled-components';

const PrivacyModal = ({ closeModal, onClick }) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <article>
        <Heading1>개인정보 수집 및 이용 동의서</Heading1>
        <Paragraph>
          「개인정보 보호법」에 따라 디스턴스에 회원가입 신청하시는 분께
          수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유
          및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내
          드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
        </Paragraph>

        <Heading2>1. 수집하는 개인정보</Heading2>
        <Paragraph>
          이용자가 채팅, 매칭과 같이 개인화된 서비스를 이용하기 위해 회원가입을
          할 경우 디스턴스는 서비스 이용을 위해 필요한 최소한의 개인정보를
          수집합니다.
        </Paragraph>

        <Paragraph>
          디스턴스가 이용자로부터 수집하는 개인정보는 아래와 같습니다.
        </Paragraph>
        <UnorderedList>
          <ListItem>
            회원 가입 시 필수항목으로 전화번호, 성별, 소속 학과명, MBTI, 취미,
            성격을, 선택항목으로 학교 도메인의 이메일 주소, 학생증 이미지,
            모바일 학생증 이미지를 수집합니다.
          </ListItem>
          <ListItem>
            서비스 제공 시 필수항목으로 서비스 이용 기록(최근 접속일, 가입일,
            이벤트 로그, 접속 브라우저 정보), 선택항목으로 기기 GPS 센서의 위도
            및 경도 데이터를 수집합니다.
          </ListItem>
        </UnorderedList>
        <Paragraph>생성정보 수집에 대한 추가 설명</Paragraph>
        <Paragraph>
          서비스 이용 과정에서 기기정보, 위치정보가 생성되어 수집될 수 있습니다.
          구체적으로 서비스 이용 과정에서 이용자에 관한 정보를 자동화된 방법으로
          생성하여 이를 저장(수집)합니다. 이와 같이 수집된 정보는 개인정보와의
          연계 여부 등에 따라 개인정보에 해당할 수 있고, 개인정보에 해당하지
          않을 수도 있습니다.
        </Paragraph>
        <UnorderedList>
          <ListItem>
            기기정보: 디스턴스는 현재 접속중인 브라우저의 정보(User Agent)만을
            확인합니다.
          </ListItem>
          <ListItem>
            위치정보: 모바일 기기(ex. 스마트폰, 노트북)에 장착되어 있는 GPS
            센서로부터 받아온 위도, 경도 데이터를 말합니다.
          </ListItem>
        </UnorderedList>

        <Heading2>2. 수집한 개인정보의 이용</Heading2>
        <Paragraph>
          디스턴스 서비스의 회원관리, 서비스 개발・제공 및 향상, 등 아래의
          목적으로만 개인정보를 이용합니다.
        </Paragraph>
        <UnorderedList>
          <ListItem>
            회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별 및 인증,
            회원자격 유지 및 관리, 서비스 부정이용 방지, 각종 고지 및 통지를
            목적으로 개인정보를 처리합니다.
          </ListItem>
          <ListItem>
            맞춤서비스 제공, 본인인증을 목적으로 개인정보를 처리합니다.
          </ListItem>
        </UnorderedList>

        <Heading2>3. 개인정보 보관기간</Heading2>
        <Paragraph>
          디스턴스는 원칙적으로 이용자의 개인정보를 회원 탈퇴 시 지체없이
          파기하고 있습니다. 단, 서비스 이용 중 서비스 운영이 종료되는 경우에는
          서비스 운영 종료일로부터 14일까지 보관합니다.
        </Paragraph>

        <Heading2>4. 개인정보 수집 및 이용 동의를 거부할 권리</Heading2>
        <Paragraph>
          이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다.
          회원가입 시 수집하는 최소한의 개인정보, 즉, 필수 항목에 대한 수집 및
          이용 동의를 거부하실 경우, 회원가입이 어려울 수 있습니다.
        </Paragraph>
      </article>

      {/* <Button
        size="medium"
        onClick={() => {
          onClick();
          closeModal();
        }}
      >
        동의하기
      </Button> */}
    </Modal>
  );
};

export default PrivacyModal;

const Modal = styled.div`
  position: fixed;
  display: grid;
  gap: 1.5rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 70%;
  box-sizing: border-box;
  padding: 4rem 1.5rem 2rem 1.5rem;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 0px #3333334d;
  z-index: 100;
  overflow: scroll;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 25px;
  right: 32px;
`;

const Heading1 = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 1rem 0;
`;

const Heading2 = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 1rem 0;
`;

const Paragraph = styled.p`
  font-size: 12px;
  font-weight: 200;
  line-height: 18px;
`;

const UnorderedList = styled.ul`
  font-size: 12px;
  font-weight: 200;
  padding-left: 1rem;
  line-height: 18px;
  list-style-type: disc;
`;

const ListItem = styled.li`
  font-size: 12px;
  font-weight: 200;
  line-height: 18px;
`;
