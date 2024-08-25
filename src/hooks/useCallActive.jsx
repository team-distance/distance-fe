import { useEffect, useState } from 'react';

export const useCallActive = (messages, roomId) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isShowLottie, setIsShowLottie] = useState(false);

  const lastMessage = messages?.at(-1);

  // 전화 버튼 활성화
  useEffect(() => {
    if (lastMessage?.checkTiKiTaKa) setIsCallActive(true);
    else setIsCallActive(false);
  }, [messages]);

  // 전화 버튼 애니메이션
  useEffect(() => {
    const callEffectShownList =
      JSON.parse(localStorage.getItem('callEffectShownList')) || [];

    if (!callEffectShownList.includes(roomId)) {
      if (isCallActive) {
        const newCallEffectShownList = [...callEffectShownList];
        newCallEffectShownList.push(roomId);
        localStorage.setItem(
          'callEffectShownList',
          JSON.stringify(newCallEffectShownList)
        );
        setIsShowLottie(true);
        setTimeout(() => {
          setIsShowLottie(false);
        }, 4000);
        // setIsCallTooltipVisible(false);
      }
    }
  }, [isCallActive]);

  return { isShowLottie, isCallActive };
};
