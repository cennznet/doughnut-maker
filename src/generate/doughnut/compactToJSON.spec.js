const { u8aToHex } = require("@polkadot/util");
const compactToJSON = require("./compactToJSON");
const {
  objectToCertificateU8a,
  certificateObjToCamelCase
} = require("./certificateMappers");
const compactPrefix = require("../doughnut/compactPrefix");
const { SIGNATURE_LENGTH } = require("../../constants");

const certificateObj = {
  issuer: new Uint8Array([1, 2, 3, 4]),
  holder: new Uint8Array([4, 3, 2, 1]),
  expiry: 555,
  not_before: 1234,
  permissions: { data: "here" },
  version: 0
};
const certificateUInt8Array = objectToCertificateU8a(certificateObj);

describe("when using compactToJSON", () => {
  it("should return the certificate as an object and signature as UInt8Array", () => {
    const signatureU8a = new Uint8Array(SIGNATURE_LENGTH);
    const compact = new Uint8Array([
      ...compactPrefix,
      ...certificateUInt8Array,
      ...signatureU8a
    ]);

    const result = compactToJSON(compact);

    const expected = {
      certificate: certificateObjToCamelCase(certificateObj),
      signature: u8aToHex(signatureU8a)
    };

    expect(result).toEqual(expected);
  });
});
