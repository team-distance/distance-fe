import { useRecoilValue } from 'recoil';
import { modalState } from '../store/modalState';

const GlobalModalContainer = () => {
  const modal = useRecoilValue(modalState);
  return modal;
};

export default GlobalModalContainer;
