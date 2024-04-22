import React, { useEffect, useState } from 'react';

const PWAInstallPrompt = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [prompt, setPropmt] = useState(null);

  useEffect(() => {
    console.log(isIos);
    console.log(navigator.standalone);
  }, [isIos]);
  const handleClick = () => {
    setIsOpened(false);
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = prompt.userChoice;
    console.log('outcome', outcome);
    setPropmt(null);
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isDeviceIos = userAgent.includes('iphone');
    setIsIos(isDeviceIos);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPropmt(e);
      setIsOpened(true);
    };

    if (isIos && !navigator.standalone) setIsOpened(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    isOpened &&
    (isIos ? (
      <div>
        <button onClick={() => setIsOpened(false)}>닫기</button>
        ios입니다.
      </div>
    ) : (
      <div>
        <button onClick={() => setIsOpened(false)}>닫기</button>
        <div>PWA를 설치하세요.</div>
        <button onClick={handleClick}>설치하기</button>
      </div>
    ))
  );
};

export default PWAInstallPrompt;
