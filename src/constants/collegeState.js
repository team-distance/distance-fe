const SCH_COLLEGE_STATE = {
  id: 'sch',
  name: '순천향대학교',
  logo: '/assets/univ-logo/SCH.svg',
  webMail: 'https://mail.sch.ac.kr/account/login.do',
  state: [
    { college: '의과대학', department: ['의예과', '의학과', '간호학과'] },
    {
      college: '자연과학대학',
      department: [
        '수학과',
        '전자물리학과',
        '화학과',
        '식품영양학과',
        '환경보건학과',
        '생명과학과',
        '스포츠과학과',
        '사회체육학과',
        '스포츠의학과',
      ],
    },
    {
      college: '인문사회과학대학',
      department: [
        '국어국문학과',
        '영어영문학과',
        '중어중문학과',
        '국제문화학과',
        '유아교육과',
        '특수교육과',
        '청소년교육상담학과',
        '연극무용학과',
        '영화애니메이션학과',
        '미디어콘텐츠학과',
        '법학과',
        '행정학과',
        '경찰행정학과',
        '신문방송학과',
        '사회복지학과',
      ],
    },
    {
      college: '글로벌경영대학',
      department: [
        'GBS',
        '경영학과',
        '국제통상학과',
        '관광경영학과',
        '경제금융학과',
        'IT금융경영학과',
        '글로벌문화산업학과',
        '회계학과',
      ],
    },
    {
      college: '공과대학',
      department: [
        '컴퓨터공학과',
        '정보통신공학과',
        '전자공학과',
        '전기공학과',
        '전자정보공학과',
        '나노화학공학과',
        '에너지환경공학과',
        '디스플레이신소재공학과',
        '기계공학과',
      ],
    },
    {
      college: 'SW융합대학',
      department: [
        '컴퓨터소프트웨어공학과',
        '정보보호학과',
        '의료IT공학과',
        'AI빅데이터학과',
        '사물인터넷학과',
        '메타버스&게임학과',
      ],
    },
    {
      college: '의료과학대학',
      department: [
        '보건행정경영학과',
        '의료생명공학과',
        '임상병리학과',
        '작업치료학과',
        '의약공학과',
        '의공학과',
      ],
    },
    {
      college: 'SCH미디어랩스',
      department: [
        '한국문화콘텐츠학과',
        '영미학과',
        '중국학과',
        '미디어커뮤니케이션학과',
        '건축학과',
        '디지털애니메이션학과',
        '스마트자동차학과',
        '에너지공학과',
        '공연영상학과',
        'SCH미디어랩스',
      ],
    },
    {
      college: '창의라이프대학',
      department: [
        '스마트팩토리공학과',
        '스마트모빌리티공학과',
        '융합바이오화학공학과',
        '산업경영공학과',
        '세무회계학과',
        '자동차산업공학과',
        '융합기계학과',
        '신뢰성품질공학과',
        '화학공학과',
        '메카트로닉스공학과',
        '창의라이프대학',
      ],
    },
    {
      college: '엔터프라이즈스쿨',
      department: [
        '융합창업학부',
        '학생기업학부',
        '컨버전스디자인학과',
        'DSC모빌리티학부',
      ],
    },
  ],
};

const KHU_COLLEGE_STATE = {
  id: 'khu',
  name: '경희대학교 (5.22~5.24 축제 종료)',
  logo: '/assets/univ-logo/KHU.svg',
  webMail: 'https://mail.khu.ac.kr/',
  state: [
    {
      college: '후마니타스컬리지',
      department: ['후마니타스컬리지'],
    },
    {
      college: '문과대학',
      department: [
        '국어국문학과',
        '영어영문학과',
        '응용영어통번역학과',
        '사학과',
        '철학과',
      ],
    },
    {
      college: '법과대학',
      department: ['법학부'],
    },
    {
      college: '정경대학',
      department: [
        '정치외교학과',
        '행정학과',
        '사회학과',
        '미디어학과',
        '경제학과',
        '무역학과',
        '국제통상학전공',
        '국제금융투자학전공',
      ],
    },
    {
      college: '경영대학',
      department: ['경영학과', '회계세무학과', '빅데이터응용학과'],
    },
    {
      college: '호텔관광대학',
      department: [
        'Hospitality경영학과',
        '조리&푸드디자인학과',
        '관광학과',
        '문화엔터테인먼트학과',
        '글로벌Hospitality관광학과',
        '문화관광산업학과',
        '조리산업학과',
      ],
    },
    {
      college: '이과대학',
      department: [
        '수학과',
        '물리학과',
        '화학과',
        '생물학과',
        '지리학과',
        '미래정보디스플레이학부',
      ],
    },
    {
      college: '생활과학대학',
      department: ['아동가족학과', '주거환경학과', '의상학과', '식품영양학과'],
    },
    {
      college: '의과대학',
      department: ['의예과', '의학과'],
    },
    {
      college: '한의과대학',
      department: ['한의예과', '한의학과'],
    },
    {
      college: '치과대학',
      department: ['치의예과', '치의학과'],
    },
    {
      college: '약학대학',
      department: ['약학과', '한약학과', '약과학과'],
    },
    {
      college: '간호과학대학',
      department: ['간호학과'],
    },
    {
      college: '음악대학',
      department: ['작곡과', '성악과', '기악과'],
    },
    {
      college: '미술대학',
      department: ['한국화전공', '회화전공', '조소전공'],
    },
    {
      college: '무용학부',
      department: ['한국무용전공', '현대무용전공', '발레전공'],
    },
    {
      college: '자율전공학부',
      department: ['글로벌리더전공', '글로벌비지니스전공'],
    },
    {
      college: '공과대학',
      department: [
        '기계공학과',
        '산업경영공학과',
        '원자력공학과',
        '화학공학과',
        '정보전자신소재공학과',
        '사회기반시스템공학과',
        '건축공학과',
        '환경학및환경공학과',
        '건축학과',
      ],
    },
    {
      college: '전자정보대학',
      department: ['전자공학과', '반도체공학과', '생체의공학과'],
    },
    {
      college: '소프트웨어융합대학',
      department: ['컴퓨터공학과', '인공지능학과', '소프트웨어융합학과'],
    },
    {
      college: '응용과학대학',
      department: ['응용수학과', '응용물리학과', '응용화학과', '우주과학과'],
    },
    {
      college: '생명과학대학',
      department: [
        '유전생명공학과',
        '식품생명공학과',
        '한방생명공학과',
        '식물환경신소재공학과',
        '원예생명공학과',
        '스마트팜과학과',
      ],
    },
    {
      college: '국제대학',
      department: ['국제학과', '글로벌한국학과'],
    },
    {
      college: '외국어대학',
      department: [
        '프랑스어학과',
        '스페인어학과',
        '러시아어학과',
        '중국어학과',
        '일본어학과',
        '한국어학과',
        '영미어문전공',
        '영미문화전공',
      ],
    },
    {
      college: '예술디자인대학',
      department: [
        '산업디자인학과',
        '시각디자인학과',
        '환경조경디자인학과',
        '의류디자인학과',
        '디지털콘텐츠학과',
        'PostModern음악학과',
        '연극영화학과',
        '도예학과',
      ],
    },
    {
      college: '체육대학',
      department: [
        '체육학과',
        '스포츠지도학과',
        '스포츠의학과',
        '골프산업학과',
        '태권도학과',
      ],
    },
    {
      college: '동서의과학과',
      department: ['동서의과학과'],
    },
  ],
};

const SWU_COLLEGE_STATE = {
  id: 'swu',
  name: '서울여자대학교 (5.22~5.24 축제 종료)',
  logo: '/assets/univ-logo/SWU.svg',
  webMail: 'https://mc183.mailplug.com/member/login?host_domain=swu.ac.kr',
  state: [
    {
      college: '인문대학',
      department: [
        '메타버스융합콘텐츠전공',
        '프랑스문화콘텐츠전공',
        '독일문화콘텐츠전공',
        '국어국문학과',
        '영어영문학과',
        '중어중문학과',
        '일어일문학과',
        '사학과',
        '기독교학과',
        '불어불문학과',
        '독어독문학과',
      ],
    },
    {
      college: '사회과학대학',
      department: [
        '경제학과',
        '문헌정보학과',
        '사회복지학과',
        '아동학과',
        '행정학과',
        '언론영상학부',
        '교육심리학과',
        '스포츠운동과학과',
      ],
    },
    {
      college: '과학기술융합대학',
      department: [
        '수학과',
        '화학과',
        '생명환경공학과',
        '바이오헬스융합학과',
        '원예생명조경학과',
        '식품공학과',
        '식품영양학과',
        '화학생명환경과학부',
        '식품응용시스템학부',
      ],
    },
    {
      college: '미래산업융합대학',
      department: [
        '경영학과',
        '패션산업학과',
        '디지털미디어학과',
        '정보보호학부',
        '소프트웨어융합학과',
        '데이터사이언스학과',
        '산업디자인학과',
      ],
    },
    {
      college: '아트앤디자인스쿨',
      department: [
        '현대미술전공',
        '공예전공',
        '시각디자인전공',
        '첨단미디어디자인전공',
      ],
    },
    {
      college: '자율전공학부',
      department: ['자율전공'],
    },
  ],
};

const DGU_COLLEGE_STATE = {
  id: 'dgu',
  name: '동국대학교',
  logo: '/assets/univ-logo/DGU.svg',
  webMail: 'https://mail.dongguk.edu/',
  state: [
    {
      college: '불교대학',
      department: ['불교학부', '문화재학과'],
    },
    {
      college: '문과대학',
      department: [
        '국어국문학전공',
        '문예창작학전공',
        '영어문학전공',
        '영어통번역학전공',
        '일본학과',
        '중어중문학과',
        '철학과',
        '사학과',
      ],
    },
    {
      college: '이과대학',
      department: [
        '수학과',
        '화학과',
        '통계학과',
        '물리학전공',
        '반도체과학전공',
      ],
    },
    {
      college: '법과대학',
      department: ['법학과'],
    },
    {
      college: '사회과학대학',
      department: [
        '정치외교학전공',
        '행정학전공',
        '북한학전공',
        '경제학과',
        '국제통상학과',
        '사회학전공',
        '미디어커뮤니케이션학전공',
        '식품산업관리학과',
        '광고홍보학과',
        '사회복지학과',
      ],
    },
    {
      college: '경찰사법대학',
      department: ['경찰학전공', '범죄과학전공', '산업보안전공', '교정학전공'],
    },
    {
      college: '경영대학',
      department: ['경영학과', '회계학과', '경영정보학과'],
    },
    {
      college: '바이오시스템대학',
      department: [
        '바이오환경과학과',
        '생명과학과',
        '식품생명공학과',
        '의생명공학과',
      ],
    },
    {
      college: '공과대학',
      department: [
        '전자전기공학전공',
        '정보통신공학과',
        '건설환경공학과',
        '화공생물공학과',
        '기계로봇에너지공학과',
        '건축공학전공',
        '건축학전공',
        '산업시스템공학과',
        '에너지신소재공학과',
      ],
    },
    {
      college: 'AI융합대학',
      department: [
        '컴퓨터공학전공',
        '멀티미디어소프트웨어공학전공',
        '인공지능전공',
        '데이터사이언스전공',
        '엔터테인먼트테크놀로지전공',
        '시스템반도체학부',
      ],
    },
    {
      college: '사범대학',
      department: [
        '교육학과',
        '국어교육과',
        '역사교육과',
        '지리교육과',
        '수학교육과',
        '가정교육과',
        '체육교육과',
      ],
    },
    {
      college: '예술대학',
      department: [
        '불교미술전공',
        '한국화전공',
        '서양화전공',
        '조소전공',
        '연극전공',
        '뮤지컬전공',
        '영화영상학과',
        '스포츠문화학과',
        '한국음악과',
      ],
    },
    {
      college: '약학대학',
      department: ['약학대학'],
    },
    {
      college: '미래융합대학',
      department: ['융합보안학과', '사회복지상담학과', '글로벌무역학과'],
    },
  ],
};

const CNU_COLLEGE_STATE = {
  id: 'cnu',
  name: '전남대학교',
  logo: '/assets/univ-logo/CNU.svg',
  webMail: 'https://portal.jnu.ac.kr/',
  state: [
    {
      college: '간호대학',
      department: ['간호학과'],
    },
    {
      college: '경영대학',
      department: ['경영학부', '경제학부'],
    },
    {
      college: '공과대학',
      department: [
        '건축학부',
        '고분자융합소재공학부',
        '기계공학부',
        '산업공학과',
        '생물공학과',
        '신소재공학부',
        '에너지자원공학과',
        '전기공학과',
        '전자컴퓨터공학부',
        '전자공학과',
        '컴퓨터정보통신공학과',
        '소프트웨어공학과',
        '토목공학과',
        '화학공학부',
        '환경에너지공학과',
      ],
    },
    {
      college: '농업생명과학대학',
      department: [
        '식품공학과',
        '분자생명공학과',
        '농생명화학과',
        '농업경제학과',
        '동물자원학부',
        '바이오에너지공학과',
        '산림자원학과',
        '임산공학과',
        '식물생명공학부',
        '조경학과',
        '지역바이오시스템공학과',
        '융합바이오시스템기계공학과',
      ],
    },
    {
      college: '사범대학',
      department: [
        '가정교육과',
        '교육학과',
        '국어교육과',
        '물리교육과',
        '생물교육과',
        '수학교육과',
        '역사교육과',
        '영어교육과',
        '유아교육과',
        '윤리교육과',
        '음악교육과',
        '지구과학교육과',
        '지리교육과',
        '체육교육과',
        '특수교육학부',
        '화학교육과',
      ],
    },
    {
      college: '사회과학대학',
      department: [
        '문헌정보학과',
        '문화인류고고학과',
        '사회학과',
        '미디어커뮤니케이션학과',
        '심리학과',
        '정치외교학과',
        '지리학과',
        '행정학과',
      ],
    },
    {
      college: '생활과학대학',
      department: ['생활복지학과', '식품영양과학부', '의류학과'],
    },
    {
      college: '수의과대학',
      department: ['수의예과', '수의학과'],
    },
    {
      college: '약학대학',
      department: ['약학부'],
    },
    {
      college: '예술대학',
      department: ['국악학과', '디자인학과', '미술학과', '음악학과'],
    },
    {
      college: '의과대학',
      department: ['의학과', '의예과'],
    },
    {
      college: '인문대학',
      department: [
        '국어국문학과',
        '독일언어문학과',
        '불어불문학과',
        '사학과',
        '영어영문학과',
        '일어일문학과',
        '중어중문학과',
        '철학과',
      ],
    },
    {
      college: '자연과학대학',
      department: [
        '물리학과',
        '생명과학기술학부',
        '생물학과',
        '수학과',
        '지구환경과학부',
        '통계학과',
        '화학과',
      ],
    },
    {
      college: 'AI융합대학',
      department: [
        '융합전공',
        '인공지능학부',
        '빅데이터융합학과',
        '지능형모빌리티융합학과',
      ],
    },
    {
      college: '자율전공학부',
      department: ['자율전공학부'],
    },
  ],
};

export const UNIV_STATE = [
  DGU_COLLEGE_STATE,
  SCH_COLLEGE_STATE,
  KHU_COLLEGE_STATE,
  SWU_COLLEGE_STATE,
  CNU_COLLEGE_STATE,
];
