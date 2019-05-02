const { stringToU8a } = require("@cennznet/util");

module.exports = inputObject => {
  const certificateString = JSON.stringify(inputObject);
  const base64Certificate = btoa(certificateString);

  return stringToU8a(base64Certificate);
};
