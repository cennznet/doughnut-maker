const {
  objectToCertificate,
  certificateToObject
} = require("./certificateMappers");
const { stringToU8a } = require("@cennznet/util");

const certificateObject = {
  issuer: new Uint8Array([1, 2, 3, 4, 5, 6]),
  holder: new Uint8Array([9, 8, 7, 6, 5]),
  expiry: 555,
  not_before: 654321,
  permissions: {
    myPermissions: true
  },
  version: 0
};

describe("when using objectToCertificate", () => {
  it("should return the correct u8a", () => {
    const result = objectToCertificate(certificateObject);

    const expected = stringToU8a(btoa(JSON.stringify(certificateObject)));

    expect(result).toEqual(expected);
  });
});

describe("when using certificateToObject", () => {
  it("should convert back to the original object", () => {
    const certificate = objectToCertificate(certificateObject);
    const result = certificateToObject(certificate);

    expect(result).toEqual(certificateObject);
  });
});
