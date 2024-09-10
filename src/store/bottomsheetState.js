import { atom } from 'recoil';
import { BOTTOMSHEET_CONFIG } from '../constants/BOTTOMSHEET_CONFIG';

export const bottomsheetState = atom({
  key: 'bottomsheetState',
  default: window.innerHeight * (1 - BOTTOMSHEET_CONFIG.collapsedHeight),
});
