/*********************
 * V0 Signing Method *
 *********************/
const {
  schnorrkelSign,
  schnorrkelVerify,
} = require("@polkadot/util-crypto");

const SIGNATURE_BYTE_LENGTH = 64;

module.exports = {
  byteLength: SIGNATURE_BYTE_LENGTH,
  sign: schnorrkelSign,
  verify: schnorrkelVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

