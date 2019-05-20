const { schnorrkelVerify } = require("@polkadot/util-crypto");

const Doughnut = require("../doughnut");
const { destructureCompact } = require("../generate/doughnut/compactMappers");

const verifyDoughnut = doughnut => {
  if (!(doughnut instanceof Doughnut)) return false;

  const { certificateU8a, signatureU8a } = destructureCompact(doughnut);
  const {
    certificate: { issuer, notBefore, expiry }
  } = doughnut.toJSON();
  const currentTimeInSeconds = Date.now() / 1000;

  if (!schnorrkelVerify(certificateU8a, signatureU8a, issuer)) {
    return false;
  }

  if (currentTimeInSeconds < notBefore) {
    return false;
  }

  if (expiry < currentTimeInSeconds) {
    return false;
  }

  return true;
};

module.exports = verifyDoughnut;
