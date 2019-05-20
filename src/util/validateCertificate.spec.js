const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed
} = require("@polkadot/util-crypto");
const { stringToU8a } = require("@polkadot/util");
const validateCertificate = require("./validateCertificate");

let issuerKeyPair;
let holderKeyPair;
let certificate;

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
});

beforeEach(() => {
  certificate = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    notBefore: 1234,
    permissions: {
      something: true
    },
    version: 0
  };
});

describe("when using validateCertificate", () => {
  it("should not throw with a valid certificate", () => {
    validateCertificate(certificate);
  });

  it("should throw if input not an object", () => {
    expect(() => validateCertificate(null)).toThrow(
      "Input should be a certificate object"
    );
  });

  it("should throw if issuer not valid", () => {
    certificate.issuer = "5555";
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property issuer that is a Uint8Array of length 32"
    );
  });

  it("should throw if holder not valid", () => {
    certificate.holder = "5555";
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property holder that is a Uint8Array of length 32"
    );
  });

  it("should throw if expiry not a number", () => {
    certificate.expiry = "5555";
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property expiry that is a unix timestamp number"
    );
  });

  it("should throw if notBefore not a number", () => {
    certificate.notBefore = "55515";
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property notBefore that is a unix timestamp number"
    );
  });

  it("should throw if permissions not an object", () => {
    certificate.permissions = [];
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property notBefore that is an object"
    );
  });

  it("should throw if version not a number", () => {
    certificate.version = "1234";
    expect(() => validateCertificate(certificate)).toThrow(
      "Certificate should have property version that is a number"
    );
  });

  it("should throw if certificate has extra keys", () => {
    certificate.extraKey = "something";
    expect(() => validateCertificate(certificate)).toThrow(
      new Error(
        "Certificate object should only have the keys in the following order: issuer, holder, expiry, notBefore, permissions, version"
      )
    );
  });
});
