const {
  schnorrkelKeypairFromSeed,
  stringToU8a,
  cryptoWaitReady,
  schnorrkelVerify
} = require("@cennznet/util");
const doughnutMaker = require("./");
const {
  objectToCertificate
} = require("./generate/doughnut/certificateMappers");
const createCompact = require("./generate/doughnut/createCompact");

let issuerKeyPair;
let holderKeyPair;
let doughnut;
const expiry = 5555;
const not_before = 1234;
const permissions = {
  has: "permissions"
};

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
  doughnut = doughnutMaker.generate.doughnut(
    issuerKeyPair,
    holderKeyPair.publicKey,
    expiry,
    not_before,
    permissions
  );
});

describe("when generating doughnut", () => {
  it("should have properties value and toJSON", () => {
    expect(doughnut.value).toBeInstanceOf(Uint8Array);
    expect(typeof doughnut.toJSON).toBe("function");
  });

  test("value should be made from certificate and signature", () => {
    const { value } = doughnut;
    const { certificate, signature } = doughnut.toJSON();

    const certificateU8a = objectToCertificate(certificate);
    expect(value).toEqual(createCompact(certificateU8a, signature));
  });

  it("should return the correct certificate", () => {
    const { certificate } = doughnut.toJSON();

    const expectedCertificateObject = {
      issuer: issuerKeyPair.publicKey,
      holder: holderKeyPair.publicKey,
      expiry,
      not_before,
      permissions,
      version: 0
    };

    expect(certificate).toEqual(expectedCertificateObject);
  });

  it("should return the correct signature", () => {
    // assuming that the certificate is correct from above
    const { certificate, signature } = doughnut.toJSON();

    const certificateU8a = objectToCertificate(certificate);
    expect(
      schnorrkelVerify(certificateU8a, signature, issuerKeyPair.publicKey)
    ).toBe(true);
  });
});
