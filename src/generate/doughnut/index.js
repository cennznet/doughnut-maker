const { schnorrkelSign } = require("@cennznet/util");

const { objectToCertificate } = require("./certificateMappers");
const createCompact = require("./createCompact");
const compactToJSON = require("./compactToJSON");

const generateDoughnut = (
  issuerKeyPair,
  holderPublicKey,
  expiry,
  not_before,
  permissions
) => {
  // TODO verify certificate structure
  const certificate = objectToCertificate({
    issuer: issuerKeyPair.publicKey,
    holder: holderPublicKey,
    expiry,
    not_before,
    permissions,
    version: 0
  });

  const signature = schnorrkelSign(certificate, issuerKeyPair);
  const compact = createCompact(certificate, signature);

  return {
    value: compact,
    toJSON: () => compactToJSON(compact)
  };
};

module.exports = generateDoughnut;
