import { useEffect } from "react";
import { useAnimate, stagger } from "framer-motion";
import styled from "styled-components";

export function useMenuAnimation(isOpen) {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const menuAnimations = isOpen
            ? [
                [
                    "li",
                    { transform: "translateY(0%)", opacity: 1, filter: "blur(0px)" },
                    { delay: stagger(0.05), at: "-0.05" }
                ]
            ]
            : [
                [
                    "li",
                    { transform: "translateY(50px)", opacity: 0, filter: "blur(10px)" },
                    { delay: stagger(0.05, { from: "last" }), at: "<" }
                ]

            ];

        animate([
            [
                "path.top",
                { d: isOpen ? "M 3 16.5 L 17 2.5" : "M 2 2.5 L 20 2.5" },
                { at: "<" }
            ],
            ["path.middle", { opacity: isOpen ? 0 : 1 }, { at: "<" }],
            [
                "path.bottom",
                { d: isOpen ? "M 3 2.5 L 17 16.346" : "M 2 16.346 L 20 16.346" },
                { at: "<" }
            ],
            ...menuAnimations
        ]);
    }, [isOpen]);

    return scope;
}

export const Menu = ({ isOpen, handleSendImage, handleReport, handleLeave }) => {
    return (
        <>
            {isOpen &&
                <BlurBackground className="background" />
            }
            <NavContainer className="menu">
                <WrapMenu>
                    <li onClick={handleSendImage}><img src="/assets/chat/picture-icon.svg" alt="사진 전송" />사진 전송</li>
                    <li onClick={handleReport}><img src="/assets/chat/report-icon.svg" alt="신고하기" />신고하기</li>
                    <li onClick={handleLeave}><img src="/assets/chat/leave-icon.svg" alt="나가기" />나가기</li>
                </WrapMenu>
            </NavContainer>
        </>
    );
}

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
    z-index: -1;
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