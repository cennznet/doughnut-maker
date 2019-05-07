const { stringToU8a } = require("@cennznet/util");
const btoa = require("btoa");
const {
  objectToCertificateU8a,
  certificateU8aToObject
} = require("./certificateMappers");

const certificateObj = {
  issuer: new Uint8Array([1, 2, 3, 4, 5, 6]),
  holder: new Uint8Array([9, 8, 7, 6, 5]),
  expiry: 555,
  not_before: 654321,
  permissions: {
    myPermissions: true
  },
  version: 0
};

describe("when using objectToCertificateU8a", () => {
  it("should return the correct u8a", () => {
    const result = objectToCertificateU8a(certificateObj);

    const expected = stringToU8a(btoa(JSON.stringify(certificateObj)));

    expect(result).toEqual(expected);
  });
});

describe("when using certificateU8aToObject", () => {
  it("should convert back to the original object", () => {
    const certificateU8a = objectToCertificateU8a(certificateObj);
    const result = certificateU8aToObject(certificateU8a);

    expect(result).toEqual(certificateObj);
  });
});
