const { schnorrkelSign } = require("@cennznet/util");

const { objectToCertificateU8a } = require("./certificateMappers");
const createCompact = require("./createCompact");
const Doughnut = require("../../doughnut");

const DEFAULT_CERTIFICATE_VERSION = 0;

const verifyInput = (
  issuerKeyPair = {},
  holderPublicKey,
  expiry,
  not_before,
  permissions
) => {
  if (
    !(issuerKeyPair.publicKey instanceof Uint8Array) ||
    issuerKeyPair.publicKey.length !== 32
  ) {
    throw new Error(
      "IssuerKeyPair must contain a publicKey of UInt8Array length 32"
    );
  }

  if (
    !(issuerKeyPair.secretKey instanceof Uint8Array) ||
    issuerKeyPair.secretKey.length !== 64
  ) {
    throw new Error(
      "IssuerKeyPair must contain a secretKey of UInt8Array length 64"
    );
  }

  if (
    !(holderPublicKey instanceof Uint8Array) ||
    holderPublicKey.length !== 32
  ) {
    throw new Error(
      "Input HolderPublicKey should be a UInt8Array of length 32"
    );
  }

  if (typeof expiry !== "number") {
    throw new Error("Input expiry should be unix timestamp number");
  }

  if (typeof not_before !== "number") {
    throw new Error("Input not_before should be unix timestamp number");
  }

  if (!(typeof permissions === "object" && permissions !== null)) {
    throw new Error("Input permissions should be an object");
  }
};

const generateDoughnut = (
  issuerKeyPair,
  holderPublicKey,
  expiry,
  not_before,
  permissions
) => {
  verifyInput(issuerKeyPair, holderPublicKey, expiry, not_before, permissions);

  const certificateU8a = objectToCertificateU8a({
    issuer: issuerKeyPair.publicKey,
    holder: holderPublicKey,
    expiry,
    not_before,
    permissions,
    version: DEFAULT_CERTIFICATE_VERSION
  });

  const signature = schnorrkelSign(certificateU8a, issuerKeyPair);
  const compact = createCompact(certificateU8a, signature);

  return new Doughnut(compact);
};

module.exports = generateDoughnut;
