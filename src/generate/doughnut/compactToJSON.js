const { u8aToHex } = require("@polkadot/util");
const {
  certificateU8aToObject,
  certificateObjToCamelCase
} = require("./certificateMappers");
const { destructureCompact } = require("./compactMappers");

const compactToJSON = compact => {
  const { certificateU8a, signatureU8a } = destructureCompact(compact);

  return {
    certificate: certificateObjToCamelCase(
      certificateU8aToObject(certificateU8a)
    ),
    signature: u8aToHex(signatureU8a)
  };
};

module.exports = compactToJSON;
