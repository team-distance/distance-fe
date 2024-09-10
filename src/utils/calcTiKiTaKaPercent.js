export const calcTiKiTaKaPercent = (TiKiTaKa, tikitakaCount) => {
  let percent = (tikitakaCount / TiKiTaKa) * 100;
  if (percent > 100) percent = 100;
  return percent;
};
