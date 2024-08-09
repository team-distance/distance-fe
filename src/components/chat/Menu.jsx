import styled from "styled-components";

const Menu = ({ isOpen, handleSendImage, handleReport, handleLeave }) => {
    return (
        <>
            <NavContainer className="menu" $isOpen={isOpen}>
                <WrapMenu>
                    <li onClick={() => {console.log("사진전송")}}><img src="/assets/chat/picture-icon.svg" alt="사진 전송" />사진 전송</li>
                    <li onClick={() => {console.log("신고하기")}}><img src="/assets/chat/report-icon.svg" alt="신고하기" />신고하기</li>
                    <li onClick={() => {console.log("나가기")}}><img src="/assets/chat/leave-icon.svg" alt="나가기" />나가기</li>
                </WrapMenu>
            </NavContainer>
            {isOpen &&
                <BlurBackground className="background" />
            }
        </>
    );
}
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
    z-index:  ${({$isOpen}) => $isOpen? "1" : '-1'}
`;

const WrapMenu = styled.ul`
    // background-color: white;
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