export const pluralizationSimple = (str) => {
  return str.slice(-1).toLowerCase() === 's' ? str : `${str}s`
}