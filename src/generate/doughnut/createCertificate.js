const { stringToU8a } = require("@cennznet/util");

module.exports = (
  issuerPublicKey,
  holderPublicKey,
  expiry,
  not_before,
  permissions
) => {
  // TODO verify certificate structure
  const certificate = {
    issuer: issuerPublicKey,
    holder: holderPublicKey,
    expiry,
    not_before,
    permissions,
    version: 0
  };

  const certificateString = JSON.stringify(certificate);
  const base64Certificate = btoa(certificateString);

  return stringToU8a(base64Certificate);
};
