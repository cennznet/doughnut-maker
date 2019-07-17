/**********************************
 * V0 Signing Method - Schnorrkel *
 **********************************/
const {
  cryptoWaitReady,
  schnorrkelSign,
  schnorrkelVerify,
} = require("@polkadot/util-crypto");

// Wrap schnorrkel functions to await wasm crypto readiness
async function sign(payload, keyPair) {
  await cryptoWaitReady();
  return schnorrkelSign(payload, keyPair);
}

async function verify(payload, signature, issuerPublicKey) {
  await cryptoWaitReady();
  return schnorrkelVerify(payload, signature, issuerPublicKey);
}

module.exports = {
  sign: sign,
  verify: verify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

