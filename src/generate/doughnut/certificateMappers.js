const atob = require("atob");
const btoa = require("btoa");
const { stringToU8a, u8aToString } = require("@polkadot/util");

const arrayMapToU8a = arrayMap => {
  return new Uint8Array(Object.values(arrayMap));
};

const objectToCertificateU8a = inputObject => {
  const certificateString = JSON.stringify(inputObject);
  const base64Certificate = btoa(certificateString);

  return stringToU8a(base64Certificate);
};

const certificateU8aToObject = certificateU8a => {
  const certificateBase64JSONString = u8aToString(certificateU8a);
  const certificateObj = JSON.parse(atob(certificateBase64JSONString));

  return {
    ...certificateObj,
    issuer: arrayMapToU8a(certificateObj.issuer),
    holder: arrayMapToU8a(certificateObj.holder)
  };
};

module.exports = {
  objectToCertificateU8a,
  certificateU8aToObject
};
