/*******************************
 * V1 Signing Method - Ed25519 *
 *******************************/
const {
  naclSign,
  naclVerify,
} = require("@polkadot/util-crypto");

// `async` is not needed here but it is required to present a consistent interface with
// other singing methods (i.e schnorrkel / sr25519)
async function sign(payload, keyPair) {
  return naclSign(payload, keyPair)
}

async function verify(payload, signature, issuerPublicKey) {
  return naclVerify(payload, signature, issuerPublicKey)
}

module.exports = {
  sign,
  verify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

