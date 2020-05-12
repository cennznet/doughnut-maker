/********************
 * Version Encoding *
 ********************/
const {
  flipEndianness,
} = require("@plugnet/binary-encoding-utilities");

const VERSION_BYTE_LENGTH = 2;
const VERSION_MASK = 0x07ff;
const SIGNATURE_MASK = 0x1f;
const SIGNATURE_OFFSET = 11;

function encode(
  payloadVersion,
  signingMethod,
) {
  if (payloadVersion > VERSION_MASK) {
    throw new Error(
      `Doughnut payload version may not be higher than ${VERSION_MASK}.`
    )
  }
  if (signingMethod > SIGNATURE_MASK) {
    throw new Error(
      `Doughnut signing method may not be higher than ${SIGNATURE_MASK}.`
    )
  }

  let version = payloadVersion & VERSION_MASK;
  version |= (signingMethod & SIGNATURE_MASK) << SIGNATURE_OFFSET;

  // final version u8a
  let encoded = new Uint8Array(VERSION_BYTE_LENGTH);
  encoded[0] = version & 0xff;
  encoded[1] = (version >> 8) & 0xff;

  return encoded;
}

function separate(doughnut) {
  let version = (doughnut[1] << 8 | doughnut[0]) & 0xffff;

  // signing method
  const signingMethod = (version >> SIGNATURE_OFFSET) & SIGNATURE_MASK;

  // payload version
  const payloadVersion = version & VERSION_MASK;

  return [
    payloadVersion,
    signingMethod,
    doughnut.slice(2)
  ]
}

module.exports = {
  encode,
  separate,
}

