/**********************************
 * V0 Signing Method - Schnorrkel *
 **********************************/
const {
  schnorrkelSign,
  schnorrkelVerify,
} = require("@polkadot/util-crypto");

module.exports = {
  sign: schnorrkelSign,
  verify: schnorrkelVerify,
  separate(doughnut) {
    return [
      doughnut.slice(0, -64),
      doughnut.slice(-64)
    ]
  }
}

