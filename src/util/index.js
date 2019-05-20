const isObject = require("./isObject");
const validateCertificate = require("./validateCertificate");
const isHexRegex = /^(0x|0X){1}[a-fA-F0-9]+/;

const isEvenHex = str => isHexRegex.test(str) && str.length % 2 === 0;

module.exports = {
  isObject,
  isEvenHex,
  validateCertificate
};
