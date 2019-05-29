/********************
 * Version Encoding *
 ********************/
const {
  flipU8aEndianness,
  flipEndianness,
  numberToLEBytes,
  LEBytesToNumber,
} = require("../../util");

const VERSION_BYTE_LENGTH = 2;
const MAX_PAYLOAD_VERSION = 2047
const MAX_SIGNING_METHOD = 31

function encode(
  payloadVersion,
  signingMethod,
) {
  if (payloadVersion > MAX_PAYLOAD_VERSION) {
    throw new Error(
      `Doughnut payload version may not be higher than ${MAX_PAYLOAD_VERSION}.`
    )
  }
  if (signingMethod > MAX_SIGNING_METHOD) {
    throw new Error(
      `Doughnut signing method may not be higher than ${MAX_SIGNING_METHOD}.`
    )
  }

  let v = new Uint16Array(1);

  // build payload version
  v[0] = payloadVersion;
  v[0] = flipEndianness(v[0], 16)

  // build signing method 5bit uInt
  const s = new Uint8Array(1);
  s[0] = signingMethod;
  s[0] = flipEndianness(s[0], 8) >> 3;

  // attach signing method to version
  v[0] |= s[0]

  // final version u8a
  let version = new Uint8Array(VERSION_BYTE_LENGTH);
  version[1] = v[0]
  v[0] = v[0] >> 8;
  version[0] = v[0]

  return version;
}

function decode() {

}

function separate(doughnut) {
  let v = new Uint16Array(1);

  v[0] |= doughnut[0];
  v[0] = v[0] << 8;
  v[0] |= doughnut[1];

  // signing method
  const s = new Uint8Array(1);
  s[0] = (v[0] & 0b00011111) << 3;
  s[0] = flipEndianness(s, 8);

  // payload version
  v[0] &= 0b1111111111100000;
  v[0] = flipEndianness(v, 16);

  return [
    v[0],
    s[0],
    doughnut.slice(2)
  ]
}

module.exports = {
  byteLength: VERSION_BYTE_LENGTH,
  encode,
  separate,
}

