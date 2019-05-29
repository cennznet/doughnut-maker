const flipU8aEndianness = require('./flipU8aEndianness');

// shift a number into n LE bytes, into an existing U8a
function numberToLEBytes(number, bytes, array, offset) {
  bytes = bytes ? bytes : 8
  offset = offset ? offset : 0

  let t = number;
  for (let i = bytes; i > 0; i--) {
    array[offset + i - 1] = t
    t = t >> 8
  }
  flipU8aEndianness(array, offset, bytes)
}
// shift a 4byte LE window into a JS number
function LEBytesToNumber(array, bytes, offset) {
  bytes = bytes ? bytes : array.length
  offset = offset ? offset : 0

  flipU8aEndianness(array, offset, bytes)

  let t = 0;
  for (let i = 0; i < bytes; i++) {
    t = t << 8
    let val = array[offset + i];
    t |= val
  }

  flipU8aEndianness(array, offset, bytes)

  return t;
}

module.exports = {
  numberToLEBytes,
  LEBytesToNumber,
}
