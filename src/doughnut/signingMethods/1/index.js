/*******************************
 * V1 Signing Method - Ed25519 *
 *******************************/
const {
  naclSign,
  naclVerify,
} = require("@polkadot/util-crypto");

const SIGNATURE_BYTE_LENGTH = 64;

module.exports = {
  byteLength: SIGNATURE_BYTE_LENGTH,
  sign: naclSign,
  verify: naclVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

