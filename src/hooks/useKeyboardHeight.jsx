import React, { useState, useEffect } from 'react';

const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const originalHeight = window.innerHeight;

    const onResize = () => {
      console.log('onResize called!');
      // const resizeHeight = window.innerHeight;
      const resizeHeight = 844;
      const heightDifference = originalHeight - resizeHeight;
      setKeyboardHeight(heightDifference > 0 ? heightDifference : 0);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return keyboardHeight;
};

export default useKeyboardHeight;
