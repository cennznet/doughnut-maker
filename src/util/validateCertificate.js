const isObject = require("./isObject");

const certificateKeysReference = [
  "issuer",
  "holder",
  "expiry",
  "notBefore",
  "permissions",
  "version"
];

const validate = certificate => {
  if (!isObject(certificate)) {
    throw new Error("Input should be a certificate object");
  }
  const {
    issuer,
    holder,
    expiry,
    notBefore,
    permissions,
    version
  } = certificate;

  if (!(issuer instanceof Uint8Array) || issuer.length !== 32) {
    throw new Error(
      "Certificate should have property issuer that is a Uint8Array of length 32"
    );
  }

  if (!(holder instanceof Uint8Array) || holder.length !== 32) {
    throw new Error(
      "Certificate should have property holder that is a Uint8Array of length 32"
    );
  }

  if (typeof expiry !== "number") {
    throw new Error(
      "Certificate should have property expiry that is a unix timestamp number"
    );
  }

  if (typeof notBefore !== "number") {
    throw new Error(
      "Certificate should have property notBefore that is a unix timestamp number"
    );
  }

  if (typeof version !== "number") {
    throw new Error(
      "Certificate should have property version that is a number"
    );
  }

  if (!isObject(permissions)) {
    throw new Error(
      "Certificate should have property notBefore that is an object"
    );
  }
};

const certificateKeysInOrder = certificate => {
  const keys1 = Object.keys(certificate);

  if (keys1.length !== certificateKeysReference.length) {
    return false;
  }

  keys1.forEach((key1, i) => {
    if (key1 !== certificateKeysReference[i]) {
      return false;
    }
  });

  return true;
};

const validateCertificate = certificate => {
  validate(certificate);

  if (!certificateKeysInOrder(certificate)) {
    const keysString = certificateKeysReference.reduce((prev, curr, i) => {
      if (i === 0) {
        prev += curr;
      } else {
        prev += `, ${curr}`;
      }

      return prev;
    }, "");
    throw new Error(
      `Certificate object should only have the keys in the following order: ${keysString}`
    );
  }
};

module.exports = validateCertificate;
