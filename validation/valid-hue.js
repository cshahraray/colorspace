const validHue = int => {
  return Number.isInteger(int) && 0 <= int <= 360;
}
  
module.exports = validHue;