// converts from camelCase to title case
//e.g convert2Hex becomes "Convert 2 Hex"
export const toTitleCase = (
  str: string,
  ignoreCapitals?: boolean,
  ignoreNum?: boolean
) => {
  if (!ignoreCapitals) {
    // add space before capital letters
    str = str.replace(/([A-Z])/g, " $1");
  }
  if (!ignoreNum) {
    // add space before numbers
    str = str.replace(/([0-9]+)/g, " $1");
  }
  // split string at spaces and uppercase first character
  str = str
    .split(/\s+/g)
    .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
    .join(" ");
  return str;
};
