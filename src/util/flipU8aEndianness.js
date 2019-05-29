const flipEndianness = require("./flipEndianness");

const getFlippedArray = (input, start, byteCount) => {
  start = start != null ? start : 0;
  byteCount = byteCount != null ? byteCount : input.length;

  // stores one swap value before it is reassigned
  const buffer = new Uint8Array(1);
  for (
    let i = start, ii = start + byteCount - 1;
    i < start + byteCount / 2;
    i++, ii--
  ) {
    buffer[0] = input[i]
    input[i] = flipEndianness(input[ii])
    input[i] = flipEndianness(input[ii])
    input[ii] = flipEndianness(buffer[0])
  }
};

module.exports = getFlippedArray;
