const { schnorrkelSign } = require("@polkadot/util-crypto");

const {
  objectToCertificateU8a,
  certificateObjToSnakeCase
} = require("./certificateMappers");
const { createCompact } = require("./compactMappers");
const Doughnut = require("../../doughnut");
const compactPrefix = require("./compactPrefix");

const verifyInput = (
  issuerKeyPair = {},
  holderPublicKey,
  expiry,
  notBefore,
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

  if (typeof notBefore !== "number") {
    throw new Error("Input notBefore should be unix timestamp number");
  }

  if (!(typeof permissions === "object" && permissions !== null)) {
    throw new Error("Input permissions should be an object");
  }
};

const generateDoughnut = (
  issuerKeyPair,
  holderPublicKey,
  expiry,
  notBefore,
  permissions
) => {
  verifyInput(issuerKeyPair, holderPublicKey, expiry, notBefore, permissions);

  const certificateObjAsSnakeCase = certificateObjToSnakeCase({
    issuer: issuerKeyPair.publicKey,
    holder: holderPublicKey,
    expiry,
    notBefore,
    permissions
  });
  const certificateU8a = objectToCertificateU8a(certificateObjAsSnakeCase);

  const signatureU8a = schnorrkelSign(certificateU8a, issuerKeyPair);
  const compact = createCompact(compactPrefix, certificateU8a, signatureU8a);

  return new Doughnut(compact);
};

module.exports = generateDoughnut;
