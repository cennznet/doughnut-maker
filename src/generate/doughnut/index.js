const { schnorrkelSign } = require("@cennznet/util");

const createCertificate = require("./objectToCertificate");
const createCompact = require("./createCompact");
const compactToJSON = require("./compactToJSON");

const generateDoughnut = (
  issuerKeyPair,
  holderPublicKey,
  expiry,
  not_before,
  permissions
) => {
  const certificate = createCertificate(
    issuerKeyPair.publicKey,
    holderPublicKey,
    expiry,
    not_before,
    permissions
  );

  const signature = schnorrkelSign(certificate, issuerKeyPair);
  const compact = createCompact(certificate, signature);

  return {
    value: compact,
    toJSON: () => compactToJSON(compact)
  };
};

module.exports = generateDoughnut;
