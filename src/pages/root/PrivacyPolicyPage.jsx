import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HeaderPrev from '../../components/common/HeaderPrev';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <Article>
      <HeaderPrev title="개인정보 처리방침" navigateTo={-1} />
      <Paragraph>
        디스턴스는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및
        관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게
        관리하고 있습니다. 이에 디스턴스는 「개인정보 보호법」 제30조에 따라 본
        개인정보처리방침을 수립하며, 본 방침을 통하여 이용자가 제공하는
        개인정보가 어떠한 용도와 방식으로 이용되고 있으며 이용자의
        개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
      </Paragraph>

      <Heading2>개인정보의 처리(수집·이용) 목적</Heading2>
      <Paragraph>
        디스턴스는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
        개인 정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
        변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는
        등 필요한 조치를 이행할 예정입니다.
      </Paragraph>
      <OrderedList>
        <ListItem>회원가입 및 관리</ListItem>
        회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별 및 인증,
        회원자격 유지 및 관리, 서비스 부정이용 방지, 각종 고지 및 통지를
        목적으로 개인정보를 처리합니다.
        <ListItem>서비스 제공</ListItem>
        맞춤서비스 제공, 본인인증을 목적으로 개인정보를 처리합니다.
      </OrderedList>

      <Heading2>처리하는 개인정보의 항목</Heading2>
      <Paragraph>
        디스턴스는 이용자의 플랫폼 이용에 따른 서비스를 수행하기 위해 최소한의
        필수 정보를 수집하고 있습니다.
      </Paragraph>
      <OrderedList>
        <ListItem>회원가입 및 관리</ListItem>
        <UnorderedList>
          <ListItem>
            [필수] 전화번호, 성별, 소속 학과명, MBTI, 취미, 성격
          </ListItem>
          <ListItem>
            [선택] 학교 도메인의 이메일 주소, 학생증 이미지, 모바일 학생증
            이미지
          </ListItem>
        </UnorderedList>

        <ListItem>서비스 제공</ListItem>
        <UnorderedList>
          <ListItem>
            [필수] 서비스 이용 기록(최근 접속일, 가입일, 이벤트 로그, 접속
            브라우저 정보)
          </ListItem>
          <ListItem>[선택] 기기 GPS 센서의 위도·경도 데이터</ListItem>
        </UnorderedList>
      </OrderedList>

      <Heading2>개인정보의 처리 및 보유 기간</Heading2>
      <Paragraph>
        디스턴스는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
        개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를
        처리·보유합니다.
      </Paragraph>
      <Paragraph>
        각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
      </Paragraph>
      <OrderedList>
        <ListItem>회원가입 및 관리</ListItem>
        <UnorderedList>
          <ListItem>서비스 탈퇴 시까지</ListItem>
          다만, 서비스 이용 중 서비스 운영이 종료되는 경우에는 서비스 운영
          종료일로부터 14일까지
        </UnorderedList>

        <ListItem>서비스 제공</ListItem>
        <UnorderedList>
          <ListItem>서비스 탈퇴 시까지</ListItem>
          다만, 서비스 이용 중 서비스 운영이 종료되는 경우에는 서비스 운영
          종료일로부터 14일까지
        </UnorderedList>
      </OrderedList>

      <Heading2>개인정보 파기 절차 및 방법</Heading2>
      <Paragraph>
        이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 기간이 경과되면
        지체없이 파기됩니다.
      </Paragraph>
      <Paragraph>
        전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게 삭제하고, 그
        밖에 기록물, 인쇄물, 서면 등의 경우 분쇄하거나 소각하여 파기합니다.
      </Paragraph>

      <Heading2>정보주체와 법정대리인의 권리·의무 및 행사방법</Heading2>
      <OrderedList>
        <ListItem>
          정보주체는 디스턴스에 대해 언제든지 개인정보 열람·정정·삭제·처리정지
          요구 등의 권리를 행사할 수 있습니다.
        </ListItem>
        <ListItem>
          권리 행사는 디스턴스에 대해 「개인정보 보호법」 시행령 제41조 제1항에
          따라 서면, 전자우편, 카카오톡 오픈채팅 등을 통하여 하실 수 있으며
          디스턴스는 이에 대해 지체없이 조치하겠습니다.
        </ListItem>
        <ListItem>
          권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을
          통하여 하실 수도 있습니다.
        </ListItem>
        이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에
        따른 위임장을 제출하셔야 합니다.
        <ListItem>
          개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제44항,
          제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.
        </ListItem>
        <ListItem>
          개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집
          대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.
        </ListItem>
        <ListItem>
          디스턴스는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구,
          처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한
          대리인인지를 확인합니다.
        </ListItem>
      </OrderedList>

      <Heading2>개인정보의 안전성 확보조치</Heading2>
      <Paragraph>
        디스턴스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
        있습니다.
      </Paragraph>
      <OrderedList>
        <ListItem>
          기술적 조치: 데이터베이스의 접근권한 관리, API 요청 및 응답의 암호화,
          웹 애플리케이션 방화벽 설치
        </ListItem>
      </OrderedList>

      <Heading2>
        개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항
      </Heading2>
      <OrderedList>
        <ListItem>
          디스턴스는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 사용자
          기기의 GPS 데이터를 사용합니다.
        </ListItem>
        <ListItem>GPS 데이터는 위도·경도로 구성된 실수 정보입니다.</ListItem>
        <OrderedList type="a">
          <ListItem>
            GPS 데이터의 사용 목적: 이용자의 위치 정보를 바탕으로 주변에
            서비스를 이용중인 또 다른 이용자를 파악하여 이용자에게 최적화된 매칭
            정보 제공을 위해 사용됩니다.
          </ListItem>
          <ListItem>
            GPS 데이터 설치·운영 및 거부: 웹브라우저의 설정을 통해 GPS 데이터
            전송을 거부할 수 있습니다.
          </ListItem>
          <ListItem>
            GPS 데이터 전송을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할
            수 있습니다.
          </ListItem>
        </OrderedList>
      </OrderedList>

      <Heading2>개인정보 보호책임자</Heading2>
      <OrderedList>
        <ListItem>
          디스턴스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
          처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
          개인정보 보호책임자를 지정하고 있습니다.
        </ListItem>
        <UnorderedList>
          <ListItem>개인정보 보호 책임자: 노주영</ListItem>
          <ListItem>
            연락처: <a href="tel:010-5039-5582">010-5039-5582</a>
          </ListItem>
        </UnorderedList>
        <ListItem>
          정보주체는 디스턴스의 서비스를 이용하시면서 발생한 모든 개인정보보호
          관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자로
          문의할 수 있습니다. 디스턴스는 정보주체의 문의에 대해 지체없이 답변 및
          처리해드릴 것입니다.
        </ListItem>
      </OrderedList>

      <Heading2>권익침해 구제방법</Heading2>
      <Paragraph>
        정보주체는 개인정보침해로 인한 구제를 받기 위하여
        개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
        분쟁해결이나 상담 등을 신청할 수 있습니다.
      </Paragraph>
      <Paragraph>
        이 밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에
        문의하시기 바랍니다.
      </Paragraph>

      <OrderedList>
        <ListItem>
          개인정보분쟁조정위원회 : (국번없이){' '}
          <a href="tel:1833-6972">1833-6972</a> (
          <a
            href="https://www.kopico.go.kr"
            target="_blank"
            rel="noreferrer noopener"
          >
            www.kopico.go.kr
          </a>
          )
        </ListItem>
        <ListItem>
          개인정보침해신고센터 : (국번없이) <a href="tel:118">118</a> (
          <a
            href="https://privacy.kisa.or.kr"
            target="_blank"
            rel="noreferrer noopener"
          >
            privacy.kisa.or.kr
          </a>
          )
        </ListItem>
        <ListItem>
          대검찰청 : (국번없이) <a href="tel:1301">1301</a> (
          <a
            href="https://www.spo.go.kr"
            target="_blank"
            rel="noreferrer noopener"
          >
            www.spo.go.kr
          </a>
          )
        </ListItem>
        <ListItem>
          경찰청 : (국번없이) <a href="tel:182">182</a> (
          <a
            href="https://cyberbureau.police.go.kr"
            target="_blank"
            rel="noreferrer noopener"
          >
            cyberbureau.police.go.kr
          </a>
          )
        </ListItem>
      </OrderedList>
      <Paragraph>
        「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제),
        제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대 하여 공공기관의
        장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는
        행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다. ※
        행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr)
        홈페이지를 참고하시기 바랍니다.
      </Paragraph>

      <Heading2>개인정보 처리방침 변경</Heading2>
      <OrderedList>
        <ListItem>이 개인정보 처리방침은 2024. 4. 30.부터 적용됩니다.</ListItem>
      </OrderedList>
    </Article>
  );
};

export default PrivacyPolicyPage;

const Article = styled.article`
  padding: 2rem;
`;

const Heading2 = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const Paragraph = styled.p`
  font-size: 12px;
  font-weight: 200;
`;

const UnorderedList = styled.ul`
  font-size: 12px;
  font-weight: 200;
  padding-left: 1rem;
`;

const OrderedList = styled.ol`
  font-size: 12px;
  font-weight: 200;
  padding-left: 1rem;
`;

const ListItem = styled.li`
  font-size: 12px;
  font-weight: 200;
`;
