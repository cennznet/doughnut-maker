/*******************************
 * V1 Signing Method - Ed25519 *
 *******************************/
const {
  naclSign,
  naclVerify,
} = require("@polkadot/util-crypto");

module.exports = {
  sign: naclSign,
  verify: naclVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

