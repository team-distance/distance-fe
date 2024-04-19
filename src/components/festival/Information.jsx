import styled from 'styled-components';
import GuideForm from '../../components/festival/GuideForm';

const Partition = styled.div`
  width: 100%;
  height: 0.3rem;
  background-color: #d9d9d9;
`;

const content = [
  {
    title: '준비물',
    img: [
      '/assets/festival/contentsImg/1.jpg',
      '/assets/festival/contentsImg/2.jpg',
      '/assets/festival/contentsImg/3.jpg',
    ],
    context: (
      <p>
        ✅ [필수] 개인 노트북 💻 <br />
        ✅ [필수] 노트북, 핸드폰 충전기 🔌 <br />
        ✅ [선택] 상비약 💊 <br />
        ✅ [선택] 방석, 담요 등 🪑 <br />
      </p>
    ),
  },
  {
    title: '유의사항',
    img: [
      '/assets/festival/contentsImg/1.jpg',
      '/assets/festival/contentsImg/2.jpg',
      '/assets/festival/contentsImg/3.jpg',
    ],
    context: (
      <p>
        1️⃣ 🦺 <b>안전이 제일</b>입니다. <b>운영단의 지시</b>에 잘 따라주세요!{' '}
        <br />
        2️⃣ ⏰ 원활한 행사 진행을 위해 입퇴실, 파일 제출 등{' '}
        <b>정해진 시간을 준수</b>해주세요.
        <br />
        3️⃣ 🍭 <b>물, 무알콜 음료, 간단한 간식</b> 외 음식은 반입 불가합니다.
        <br />
        4️⃣ 🍺 <b>음주는 절대 불가</b>합니다. 적발 시, <b>🚨 퇴장 조치 🚨</b> 및
        불이익이 생길 수 있습니다.
      </p>
    ),
  },
  {
    title: '멘토링 시간 안내',
    img: [
      '/assets/festival/contentsImg/1.jpg',
      '/assets/festival/contentsImg/2.jpg',
      '/assets/festival/contentsImg/3.jpg',
    ],
    context: (
      <p>
        벚꽃톤 당일 멘토링 시간 안내 드립니다. <br />
        많은 팀이 멘토링을 받을 수 있도록, 각 팀 멘토링 시간에 제한을
        두었습니다. <br />
        - 1차 스프린트 / 2차 스프린트 : 각 팀당 `30분` 으로 제한
        <br />
        - 3차 스프린트 : 각 팀당 `15분` 으로 제한
        <br />
        자세한 사항은 아래 페이지 참고 부탁드립니다
      </p>
    ),
  },
  {
    title: '발표방식',
    img: [
      '/assets/festival/contentsImg/1.jpg',
      '/assets/festival/contentsImg/2.jpg',
      '/assets/festival/contentsImg/3.jpg',
    ],
    context: (
      <p>
        <b>✅ 발표자료 양식은 PDF만 가능합니다.</b>
        <br />
        ✅ <b>PDF 또는 시연</b>을 통한 발표가 가능합니다. ✅ 
        <b>팀당 4분, 질의응답 2분 진행</b>되며 시간을 초과하는 경우 발표가{' '}
        <b>강제 종료</b> 됩니다.
        <br />
        ✅ 모든 발표는 각 팀별 기기에 HDMI를 연결해 진행합니다.
        <br />
        ➕ 아침식사 시간에 팀별 HDMI 연결 테스트 가능.
      </p>
    ),
  },
];

const Information = () => {
  return (
    <>
      <GuideForm content={content[0]} />
      <Partition />
      <GuideForm content={content[1]} />
      <Partition />
      <GuideForm content={content[2]} />
      <Partition />
      <GuideForm content={content[3]} />
    </>
  );
};
export default Information;
