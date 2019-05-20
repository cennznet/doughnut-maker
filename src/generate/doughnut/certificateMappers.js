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

const ObjectReplaceKeyInOrder = (obj, prevKey, nextKey) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  keys.splice(keys.indexOf(prevKey), 1, nextKey);
  const result = {};
  keys.forEach((key, index) => {
    result[key] = values[index];
  });

  return result;
};

/*
In the version 0 of the compact encoding, the case and order of the certificate JSON affects
the compact output.
The javascript input and JSON output have camelcase for this SDK, however the JSON required 
to create the compact uses snakecase.
When case and order of the certificate dont matter, we can simplify the logic of the code
using these functions.
*/
const certificateObjToSnakeCase = certificateObj => {
  return ObjectReplaceKeyInOrder(certificateObj, "notBefore", "not_before");
};

const certificateObjToCamelCase = certificateObj => {
  return ObjectReplaceKeyInOrder(certificateObj, "not_before", "notBefore");
};

module.exports = {
  objectToCertificateU8a,
  certificateU8aToObject,
  certificateObjToCamelCase,
  certificateObjToSnakeCase
};
