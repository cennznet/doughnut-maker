/**********************************
 * V0 Signing Method - Schnorrkel *
 **********************************/
const {
  schnorrkelSign,
  schnorrkelVerify,
} = require("@polkadot/util-crypto");
const { isReady } = require('@polkadot/wasm-crypto');

function wait_ms(ms) {
  var start = Date.now();
  while (Date.now() - start < ms) {}
}

// Wrap schnorrkel signing to await wasm crypto readiness
function sign(payload, keypair) {
    for(i = 0; i < 10; i++) {
      if(!isReady()) wait_ms(10);
    }
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

