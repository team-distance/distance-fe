import { useEffect, useState } from 'react';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';

    return () => (document.body.style.overflow = 'auto');
  }, [isOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

export default useModal;
