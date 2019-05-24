const {
  schnorrkelKeypairFromSeed,
  cryptoWaitReady
} = require("@polkadot/util-crypto");
const { hexToU8a, stringToU8a } = require("@polkadot/util");
const Doughnut = require("../../doughnut");
const { json } = require("./index");
const { createCompact } = require("../doughnut/compactMappers");
const {
  objectToCertificateU8a,
  certificateObjToSnakeCase
} = require("../doughnut/certificateMappers");

const mockSignature = "0x1234";
let issuerKeyPair;
let holderKeyPair;
let certificateObj;
const version = 52;

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
  certificateObj = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555,
    notBefore: 654321,
    permissions: {
      myPermissions: true
    },
    version
  };
});

describe("when generating doughnut with JSON", () => {
  it("should return a Doughnut with a compact generated from the JSON", () => {
    const input = { certificate: certificateObj, signature: mockSignature };
    const result = json(input);

    const certificateU8aSnakeCase = objectToCertificateU8a(
      certificateObjToSnakeCase(certificateObj)
    );
    const prefix = new Uint8Array([version]);

    const expectedDoughnut = new Doughnut(
      createCompact(prefix, certificateU8aSnakeCase, hexToU8a(mockSignature))
    );
    expect(result).toEqual(expectedDoughnut);
  });

  it("should throw if certificate null", () => {
    const input = { certificate: null, signature: mockSignature };
    expect(() => json(input)).toThrow();
  });

  it("should throw if certificate array", () => {
    const input = { certificate: [], signature: mockSignature };

    expect(() => json(input)).toThrow();
  });

  it("should throw if signature not a string", () => {
    const input = { certificate: certificateObj, signature: 123 };

    expect(() => json(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });

  it("should throw if signature string but not hex", () => {
    const input = { certificate: certificateObj, signature: "1234" };

    expect(() => json(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });

  it("should throw if signature string hex but has odd length", () => {
    const input = { certificate: certificateObj, signature: "0x12345" };

    expect(() => json(input)).toThrow(
      "Compact JSON should have a property 'signature' that is a hex string of even length"
    );
  });
});
