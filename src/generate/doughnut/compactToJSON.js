const { certificateToObject } = require("./certificateMappers");
const FULL_STOP_ASCII = 46;

const compactToJSON = compact => {
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificate = compact.slice(0, fullStopIndex);
  const signature = compact.slice(fullStopIndex + 1);

  return {
    certificate: certificateToObject(certificate),
    signature
  };
};

module.exports = compactToJSON;
