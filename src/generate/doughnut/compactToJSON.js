const { certificateU8aToObject } = require("./certificateMappers");
const FULL_STOP_ASCII = 46;

const compactToJSON = compact => {
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificateU8a = compact.slice(0, fullStopIndex);
  const signature = compact.slice(fullStopIndex + 1);

  return {
    certificate: certificateU8aToObject(certificateU8a),
    signature
  };
};

module.exports = compactToJSON;
