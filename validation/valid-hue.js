const validHue = int => {
  return Number.isInteger(int) && (0 <= int && int <= 360);
}
  
module.exports = validHue;