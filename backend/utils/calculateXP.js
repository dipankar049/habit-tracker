module.exports = function calculateXP(duration) {
  const defaultMin = parseInt(duration);

  if (defaultMin >= 120) return 10;
  if (defaultMin >= 90) return 5;
  if (defaultMin >= 60) return 3;
  if (defaultMin >= 30) return 2;
  return 1;
};