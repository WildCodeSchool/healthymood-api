const tryParseInt = (str, defaultValue = NaN) => {
  const res = parseInt(str, 10) || defaultValue;
  return res;
};

module.exports = {
  tryParseInt
};
