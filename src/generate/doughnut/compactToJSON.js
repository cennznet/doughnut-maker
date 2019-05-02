const { u8aToString } = require("@cennznet/util");
const FULL_STOP_ASCII = 46;

const compactToJSON = compact => {
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificateU8a = compact.slice(0, fullStopIndex);
  const signature = compact.slice(fullStopIndex + 1);

  const certificateBase64JSONString = u8aToString(certificateU8a);
  const certificateObject = JSON.parse(atob(certificateBase64JSONString));

  return {
    certificate: certificateObject,
    signature
  };
};

module.exports = compactToJSON;
