import styled from 'styled-components';
import React from 'react';

const TermsModal = ({ closeModal, onClick }) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <article>
        <Heading1>서비스 이용 약관</Heading1>
        <Heading2>디스턴스에 오신 여러분, 환영합니다.</Heading2>
        <Paragraph>
          축제를 200% 즐기는 방법, 디스턴스(이하 ‘서비스’)를 이용해주셔서
          감사합니다. 본 약관은 서비스 이용과 관련하여 디스턴스 서비스
          운영진(이하 ‘운영진’)과 이를 이용하는 디스턴스 회원(이하 ‘회원’) 간의
          관계를 설명하며, 아울러 여러분의 서비스 이용에 도움이 될 수 있는
          유익한 정보를 포함하고 있습니다. 서비스를 이용하시거나 회원으로
          가입하실 경우 여러분은 본 약관을 확인하거나 동의하게 되므로, 잠시
          시간을 내시어 주의 깊게 살펴봐 주시기 바랍니다.
        </Paragraph>

        <Heading2>
          디스턴스 서비스 이용과 관련하여 몇 가지 주의사항이 있습니다.
        </Heading2>
        <Paragraph>
          운영진은 여러분이 축제기간 동안 즐거운 경험을 가져가실 수 있도록
          최선을 다하고 있습니다. 다만, 여러분이 디스턴스 서비스를 보다 안전하게
          이용하고 디스턴스 서비스에서 여러분과 타인의 권리가 서로 존중되고
          보호받으려면 여러분의 도움과 협조가 필요합니다. 여러분의 안전한 서비스
          이용과 권리 보호를 위해 부득이 아래와 같은 경우 여러분의 계정 이용이
          제한될 수 있으므로, 이에 대한 확인 및 준수를 요청합니다.
        </Paragraph>
        <UnorderedList>
          <ListItem>
            회원가입 및 프로필 정보 등록 시 정보를 허위로 기재해서는 안 됩니다.
            회원 계정에 등록된 정보는 항상 정확한 정보를 등록해주세요. 또한,
            자신의 계정을 다른 사람에게 판매, 양도, 대여 또는 담보로 제공하거나
            다른 사람에게 그 사용을 허락해서는 안 됩니다. 아울러 자신의 계정이
            아닌 타인의 계정을 무단으로 사용해서는 안 됩니다.
          </ListItem>
          <ListItem>
            학생인증 시 타인의 학생증이나 학생 메일 주소를 사용해서는 안 됩니다.
            서비스의 원활한 운영을 위해 본인의 정보만 사용해주세요.
          </ListItem>
          <ListItem>
            타인에 대해 직접적이고 명백한 신체적 위협을 가하는 내용의 게시물,
            타인의 자해 행위 또는 자살을 부추기거나 권장하는 내용의 게시물,
            타인의 신상정보, 사생활 등 비공개 개인정보를 드러내는 내용의 메시지,
            타인을 지속적으로 따돌리거나 괴롭히는 내용의 메시지, 성매매를 제안,
            알선, 유인 또는 강요하는 내용의 메시지, 공공 안전에 대해 직접적이고
            심각한 위협을 가하는 내용의 메시지는 계정 이용이 제한될 수 있습니다.
          </ListItem>
          <ListItem>
            관련 법령상 금지되거나 형사처벌의 대상이 되는 행위를 수행하거나 이를
            교사 또는 방조하는 등의 범죄 관련 직접적인 위험이 확인된 메시지,
            관련 법령에서 홍보, 광고, 판매 등을 금지하고 있는 물건 또는 서비스를
            홍보, 광고, 판매하는 내용의 게시물, 타인의 지식재산권 등을
            침해하거나 모욕, 사생활 침해 또는 명예훼손 등 타인의 권리를 침해하는
            내용이 확인된 메시지는 계정 이용이 제한될 수 있습니다.
          </ListItem>
          <ListItem>
            자극적이고 노골적인 성행위를 묘사하는 등 타인에게 성적 수치심을
            유발하거나 왜곡된 성 의식 등을 야기할 수 있는 내용의 메시지,
            타인에게 잔혹감 또는 혐오감을 일으킬 수 있는 폭력적이고 자극적인
            내용의 메시지, 본인 이외의 타인을 사칭하거나 허위사실을 주장하는 등
            타인을 기만하는 내용의 메시지, 과도한 욕설, 비속도 등을 계속하여
            반복적으로 사용하여 심한 혐오감 또는 불쾌감을 일으키는 내용의
            메시지는 계정 이용이 제한될 수 있습니다.
          </ListItem>
          <ListItem>
            자동화된 수단을 활용하는 등 서비스의 기능을 비정상적으로 이용하는
            경우 다른 이용자들의 정상적인 서비스 이용에 불편을 초래하고 더
            나아가 디스턴스의 원활한 서비스 제공을 방해하므로 역시 계정 이용이
            제한될 수 있습니다.
          </ListItem>
          <ListItem>
            디스턴스의 사전 허락 없이 자동화된 수단 (예: 매크로 프로그램,
            로봇(봇), 스파이더, 스크래퍼 등)을 이용하여 서비스 회원으로 가입을
            시도 또는 가입하거나, 서비스에 로그인을 시도 또는 로그인하거나,
            서비스 내 타인에게 메시지를 전송 혹은 열람하거나, 서비스에 게재된
            회원의 정보(전화번호, 학적, 학생증, 학생 메일)를 수집하거나,
            서비스의 제공 취지에 부합하지 않는 방식으로 서비스를 이용하거나 이와
            같은 서비스에 대한 어뷰징(남용) 행위를 막기 위한 디스턴스의 기술적
            조치를 무력화하려는 일체의 행위(예: GPS 정보를 지속적으로 바꿔가며
            접속하는 행위, 타인을 사칭하여 본인이 속해있지 않은 대화방에
            접속하는 행위)를 시도해서는 안됩니다.
          </ListItem>
          <ListItem>
            디스턴스 서비스 또는 이에 포함된 소프트웨어를 복사, 수정할 수
            없으며, 이를 판매, 양도, 대여 또는 담보로 제공하거나 타인에게 그
            이용을 허락해서는 안됩니다. 디스턴스 서비스에 포함된 소프트웨어를 역
            설계, 소스코드 추출 시도, 복제, 분해, 모방, 기타 변형하는 등의
            행위도 금지됩니다(다만, 오픈소스에 해당되는 경우 그 자체 조건에
            따릅니다.). 그 밖에 바이러스나 기타 악성 코드를 업로드하거나
            서비스의 원할한 운영을 방해할 목적으로 서비스 기능을 비정상적으로
            이용하는 행위 역시 금지됩니다.
          </ListItem>
          <ListItem>
            디스턴스 서비스를 매개로 한 여러분과 다른 회원 간의 커뮤니케이션,
            거래 등에서 발생한 손해나 여러분이 서비스 상에 게재된 타인의 메시지
            등의 콘텐츠를 신뢰함으로써 발생한 손해에 대해서 디스턴스는 특별한
            사정이 없는 한 이에 관해 책임을 부담하지 않습니다.
          </ListItem>
        </UnorderedList>
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

export default TermsModal;

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
