import { useEffect } from 'react';
import { useAnimate, stagger } from 'framer-motion';

const useMenuAnimation = (isOpen) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const menuAnimations = isOpen
      ? [
          [
            "nav",
            { transform: "translateY(0%)", zIndex: -1, height: "auto"},
            { ease: [0.2, 0.8, 0.2, 1], duration: 0.6 }
          ],
          [
            'li',
            { transform: 'translateY(0%)', opacity: 1, filter: 'blur(0px)' },
            { delay: stagger(0.05), at: '-1' },
          ],
        ]
      : [
          [
            'li',
            {
              transform: 'translateY(50px)',
              opacity: 0,
              filter: 'blur(10px)',
            },
            { delay: stagger(0.05, { from: 'last' }), at: '<' },
          ],
          ["nav", { transform: "translateY(100%)" }, { at: "-0.1" }]
        ];

    animate([
      [
        'path.top',
        { d: isOpen ? 'M 3 16.5 L 17 2.5' : 'M 2 2.5 L 20 2.5' },
        { at: '<' },
      ],
      ['path.middle', { opacity: isOpen ? 0 : 1 }, { at: '<' }],
      [
        'path.bottom',
        { d: isOpen ? 'M 3 2.5 L 17 16.346' : 'M 2 16.346 L 20 16.346' },
        { at: '<' },
      ],
      ...menuAnimations,
    ]);

    //메뉴가 여닫힌 후 z-index를 변경
    if (isOpen) {
      // 열릴 때
      setTimeout(() => {
        animate("nav", { zIndex: 9999 });
      }, 600);
    }else {
      // 닫힐 때
      setTimeout(() => {
        animate("nav", { zIndex: -1, height: 0 });
      }, 600);
    }

  }, [isOpen]);

  return scope;
};

export default useMenuAnimation;
