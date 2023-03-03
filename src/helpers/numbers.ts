export const getRandom = (min = 0, max = 1) => {
  let range = max - min;
  return Math.random() * range + min;
};
export const getRandomInt = (min = 0, max = 1) => {
  return Math.floor(getRandom(min, max));
};

export const roundToDecimalPlace = (num: number, decimalPlace: number) => {
  // decimalPlace should be positive integer
  decimalPlace = Math.floor(Math.abs(decimalPlace));
  return Math.round(num * 10 ** decimalPlace) / 10 ** decimalPlace;
};
