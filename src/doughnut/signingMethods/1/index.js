/*******************************
 * V1 Signing Method - Ed25519 *
 *******************************/
const {
  naclSign,
  naclVerify,
} = require("@polkadot/util-crypto");

async function sign(payload, keypair) {
  return naclSign(payload, keypair)
}

module.exports = {
  sign: sign,
  verify: naclVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

