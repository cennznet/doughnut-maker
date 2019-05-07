const { u8aToHex } = require("@polkadot/util");
const {
  certificateU8aToObject,
  certificateObjToCamelCase
} = require("./certificateMappers");
const FULL_STOP_ASCII = 46;

const destructureCompact = compact => {
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificateU8a = compact.slice(0, fullStopIndex);
  const signatureU8a = compact.slice(fullStopIndex + 1);

  return { certificateU8a, signatureU8a };
};

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
