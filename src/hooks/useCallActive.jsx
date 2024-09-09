import { useEffect, useState } from 'react';
import { TiKiTaKa } from '../constants/TiKiTaKaCount';

export const useCallActive = (messages, roomId) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isShowLottie, setIsShowLottie] = useState(false);
  const [tiKiTaKaCount, setTiKiTaKaCount] = useState(0);

  const lastMessage = messages?.at(-1);

  // 전화 버튼 활성화
  useEffect(() => {
    setTiKiTaKaCount(lastMessage?.checkTiKiTaKa);
    if (lastMessage?.checkTiKiTaKa >= TiKiTaKa) setIsCallActive(true);
    else setIsCallActive(false);
  }, [lastMessage]);

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
      }
    }
  }, [isCallActive]);

  return { isCallActive, isShowLottie, tiKiTaKaCount };
};
