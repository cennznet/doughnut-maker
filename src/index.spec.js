const { stringToU8a, u8aToHex } = require("@polkadot/util");
const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed,
  schnorrkelVerify
} = require("@polkadot/util-crypto");
const doughnutMaker = require("./");
const {
  objectToCertificateU8a
} = require("./generate/doughnut/certificateMappers");
const Doughnut = require("./doughnut");
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
  it("should be an instance of Doughnut", () => {
    expect(doughnut).toBeInstanceOf(Doughnut);
  });

  test("doughnut should be made from certificate and signature", () => {
    const { certificate, signature } = doughnut.toJSON();

    const certificateU8a = objectToCertificateU8a(certificate);

    const expectedDoughnut = new Doughnut(
      createCompact(certificateU8a, signature)
    );
    expect(doughnut).toEqual(expectedDoughnut);
  });

  it("should return the correct certificate", () => {
    const { certificate } = doughnut.toJSON();

    const expectedcertificateObj = {
      issuer: issuerKeyPair.publicKey,
      holder: holderKeyPair.publicKey,
      expiry,
      not_before,
      permissions,
      version: 0
    };

    expect(certificate).toEqual(expectedcertificateObj);
  });

  it("should return the correct signature", () => {
    // assuming that the certificate is correct from above
    const { certificate, signature } = doughnut.toJSON();

    const certificateU8a = objectToCertificateU8a(certificate);
    expect(
      schnorrkelVerify(certificateU8a, signature, issuerKeyPair.publicKey)
    ).toBe(true);
  });

  it("doughnut toHex returns doughtnut as hex", () => {
    const hex = doughnut.toHex();

    const expectedHex = u8aToHex(doughnut);
    expect(hex).toEqual(expectedHex);
  });

  describe("input verification", () => {
    it("should throw if issuerKeyPair publicKey not u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: "6".repeat(32),
            secretKey: issuerKeyPair.secretKey
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a publicKey of UInt8Array length 32"
      );
    });

    it("should throw if issuerKeyPair publicKey not length 32", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: new Uint8Array([1, 2, 3, 4]),
            secretKey: issuerKeyPair.secretKey
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a publicKey of UInt8Array length 32"
      );
    });

    it("should throw if issuerKeyPair secretKey not u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: issuerKeyPair.publicKey,
            secretKey: "6".repeat(64)
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a secretKey of UInt8Array length 64"
      );
    });

    it("should throw if issuerKeyPair secretKey not length 64", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          {
            publicKey: issuerKeyPair.publicKey,
            secretKey: new Uint8Array([1, 2, 3, 4])
          },
          holderKeyPair.publicKey,
          expiry,
          not_before,
          permissions
        )
      ).toThrow(
        "IssuerKeyPair must contain a secretKey of UInt8Array length 64"
      );
    });

    it("should throw if holderPublicKey not a u8a", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          "6".repeat(32),
          expiry,
          not_before,
          permissions
        )
      ).toThrow("Input HolderPublicKey should be a UInt8Array of length 32");
    });

    it("should throw if holderPublicKey a u8a of length not 32", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          new Uint8Array([1, 2, 3, 4]),
          expiry,
          not_before,
          permissions
        )
      ).toThrow("Input HolderPublicKey should be a UInt8Array of length 32");
    });

    it("should throw if not_before not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          expiry,
          "",
          permissions
        )
      ).toThrow("Input not_before should be unix timestamp number");
    });

    it("should throw if expiry not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          "",
          not_before,
          permissions
        )
      ).toThrow("Input expiry should be unix timestamp number");
    });

    it("should throw if permissions not an object", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          expiry,
          not_before,
          () => {}
        )
      ).toThrow("Input permissions should be an object");
    });
  });
});
