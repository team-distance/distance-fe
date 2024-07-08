import React from 'react';
import styled from 'styled-components';
import HeaderPrev from '../../components/common/HeaderPrev';

const TeamIntroductionPage = () => {
  return (
    <Wrapper>
      <HeaderPrev title="팀 소개" navigateTo={-1} />
      <img src="/assets/logo-pink.png" alt="디스턴스 로고" width={156} />
      <Paragraph>
        team distance는{' '}
        <img
          src="/assets/team-introduction/goormthon.png"
          alt="구름톤 유니브"
        />{' '}
        에서 만나 시작되었습니다!
        <br />
        distance는 위치 기반으로 운영되며, 새로운 사람들을 통한 유저의 다양한
        경험을 제공합니다. 학생들이 학교 내에서 쉽게 연결되고 소통할 수 있는
        플랫폼을 만드는 것이 team distance의 목표입니다.
        <br />
        team distance는 두 달이 넘는 시간 동안 매일 함께 고민하고 노력해
        완성하였습니다. 우리는 우리의 열정과 노력의 결실을 거두어 여러분들에게
        선보일 준비가 되었습니다!
        <br />
        team distance는 끊임없는 도전 속에서 여러분들에게 새로운 가치를
        제공하고자 합니다. 함께 distance를 만나보시고, 새로운 경험과 소통의
        세계를 경험해 보세요!
      </Paragraph>

      <ProfileWrapper>
        <Profile>
          <img src="/assets/team-introduction/juyeong.png" alt="노주영" />
          <div className="profile">
            <div className="name">노주영</div>
            <div className="part">FE</div>
          </div>
          <div className="school">전남대학교</div>

          <div className="grid">
            <div className="attr">github</div>
            <a
              href="https://github.com/juyeongnoh"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              https://github.com/juyeongnoh
            </a>
            <div className="attr">contact</div>
            <a
              href="mailto:juyeongnoh@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              juyeongnoh@gmail.com
            </a>
            <div className="attr">stack</div>
            <div className="contents">React, JS</div>
          </div>
        </Profile>

        <Profile>
          <img src="/assets/team-introduction/solmi.png" alt="박솔미" />
          <div className="profile">
            <div className="name">박솔미</div>
            <div className="part">FE</div>
          </div>
          <div className="school">서울여자대학교</div>

          <div className="grid">
            <div className="attr">github</div>
            <a
              href="https://github.com/Parksolmi"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              https://github.com/Parksolmi
            </a>
            <div className="attr">contact</div>
            <a
              href="mailto:7548ck@naver.com"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              7548ck@naver.com
            </a>
            <div className="attr">stack</div>
            <div className="contents">React, JS</div>
          </div>
        </Profile>

        <Profile>
          <img src="/assets/team-introduction/junseok.png" alt="이준석" />
          <div className="profile">
            <div className="name">이준석</div>
            <div className="part">BE</div>
          </div>
          <div className="school">순천향대학교</div>

          <div className="grid">
            <div className="attr">github</div>
            <a
              href="https://github.com/JunRock"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              https://github.com/JunRock
            </a>
            <div className="attr">contact</div>
            <a
              href="mailto:wnstjr120422@naver.com"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              wnstjr120422@naver.com
            </a>
            <div className="attr">stack</div>
            <div className="contents">
              Spring Boot, Spring Data Jpa, Docker, Mysql, Java 17
            </div>
          </div>
        </Profile>

        <Profile>
          <img src="/assets/team-introduction/nayoung.png" alt="김나영" />
          <div className="profile">
            <div className="name">김나영</div>
            <div className="part">PD</div>
          </div>
          <div className="school">한국외국어대학교</div>

          <div className="grid">
            <div className="attr">portfolio</div>
            <a
              href="https://bit.ly/4a0cvCP"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              https://bit.ly/4a0cvCP
            </a>
            <div className="attr">contact</div>
            <a
              href="mailto:naongsiii@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              className="contents"
            >
              naongsiii@gmail.com
            </a>
            <div className="attr">tool</div>
            <div className="contents">Ai, Ps, Figma</div>
          </div>
        </Profile>
      </ProfileWrapper>
    </Wrapper>
  );
};

export default TeamIntroductionPage;

const Wrapper = styled.div`
  padding: 2rem;
`;

const Paragraph = styled.p`
  font-size: 12px;
  font-weight: 200;
  line-height: 18px;
  margin: 1rem 0;

  img {
    width: 56px;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  img {
    width: 96px;
  }

  .profile {
    display: flex;
    align-items: end;
    gap: 0.2rem;
    .name {
      font-size: 20px;
      font-weight: 900;
    }
    .part {
      font-size: 12px;
      font-weight: 900;
    }
  }

  .school {
    font-size: 14px;
    font-weight: 600;
  }

  .grid {
    display: grid;

    grid-template-columns: 1fr 2fr;
    gap: 0.5rem;

    .attr {
      font-size: 14px;
      font-weight: 600;
    }
    .contents {
      font-size: 12px;
      font-weight: 200;
    }
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
