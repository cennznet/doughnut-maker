const { hexToU8a } = require("@polkadot/util");
const Doughnut = require("../../doughnut");
const { fromJSON } = require("./index");
const { createCompact } = require("../doughnut/compactMappers");
const {
  objectToCertificateU8a,
  certificateObjToSnakeCase
} = require("../doughnut/certificateMappers");

const certificateObj = {
  issuer: new Uint8Array([1, 2, 3, 4, 5, 6]),
  holder: new Uint8Array([9, 8, 7, 6, 5]),
  expiry: 555,
  notBefore: 654321,
  permissions: {
    myPermissions: true
  },
  version: 0
};
const mockSignature = "0x1234";

describe("when generating doughnut with JSON", () => {
  it("should return a Doughnut with a compact generated from the JSON", () => {
    const input = { certificate: certificateObj, signature: mockSignature };
    const result = fromJSON(input);

    const certificateU8aSnakeCase = objectToCertificateU8a(
      certificateObjToSnakeCase(certificateObj)
    );

    const expectedDoughnut = new Doughnut(
      createCompact(certificateU8aSnakeCase, hexToU8a(mockSignature))
    );
    expect(result).toEqual(expectedDoughnut);
  });

  it("should throw if certificate null", () => {
    const input = { certificate: null, signature: mockSignature };
    expect(() => fromJSON(input)).toThrow(
      "Compact JSON should have a property 'certificate' that is a certificate object"
    );
  });

  it("should throw if certificate array", () => {
    const input = { certificate: [], signature: mockSignature };

    expect(() => fromJSON(input)).toThrow(
      "Compact JSON should have a property 'certificate' that is a certificate object"
    );
  });

  it("should throw if signature not a string", () => {
    const input = { certificate: certificateObj, signature: 123 };

    expect(() => fromJSON(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });

  it("should throw if signature string but not hex", () => {
    const input = { certificate: certificateObj, signature: "1234" };

    expect(() => fromJSON(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });

  it("should throw if signature string hex but has odd length", () => {
    const input = { certificate: certificateObj, signature: "0x12345" };

    expect(() => fromJSON(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });
});
