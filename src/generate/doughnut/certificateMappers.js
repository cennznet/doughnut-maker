const { stringToU8a, u8aToString } = require("@cennznet/util");

const arrayMapToU8a = arrayMap => {
  return new Uint8Array(Object.values(arrayMap));
};

const objectToCertificate = inputObject => {
  const certificateString = JSON.stringify(inputObject);
  const base64Certificate = btoa(certificateString);

  return stringToU8a(base64Certificate);
};

const certificateToObject = certificate => {
  const certificateBase64JSONString = u8aToString(certificate);
  const certificateObject = JSON.parse(atob(certificateBase64JSONString));

  return {
    ...certificateObject,
    issuer: arrayMapToU8a(certificateObject.issuer),
    holder: arrayMapToU8a(certificateObject.holder)
  };
};

module.exports = {
  objectToCertificate,
  certificateToObject
};
