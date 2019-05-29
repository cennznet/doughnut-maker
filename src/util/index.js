const isObject = require("./isObject");
const flipEndianness = require("./flipEndianness");
const flipU8aEndianness = require("./flipU8aEndianness");
const { numberToLEBytes, LEBytesToNumber } = require("./numberLEBytes");
const isHexRegex = /^(0x|0X){1}[a-fA-F0-9]+/;

const isEvenHex = str => isHexRegex.test(str) && str.length % 2 === 0;

module.exports = {
  isObject,
  isEvenHex,
  flipEndianness,
  flipU8aEndianness,
  numberToLEBytes,
  LEBytesToNumber,
};
