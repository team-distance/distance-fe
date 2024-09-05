function useSendMessageAnimation(visible) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      '.message-by-me',
      {
        clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 0%)',
        scale: visible ? 1 : 0,
        opacity: visible ? 1 : 0,
      },
      {
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }
    );
  }, [visible, animate]);

  return scope;
}
