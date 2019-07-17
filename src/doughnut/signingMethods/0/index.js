/**********************************
 * V0 Signing Method - Schnorrkel *
 **********************************/
const {
  cryptoWaitReady,
  schnorrkelSign,
  schnorrkelVerify,
} = require("@polkadot/util-crypto");

// Wrap schnorrkel signing to await wasm crypto readiness
async function sign(payload, keypair) {
    await cryptoWaitReady();
    return schnorrkelSign(payload, keypair);
}

module.exports = {
  sign: sign,
  verify: schnorrkelVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

