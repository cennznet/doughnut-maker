const { stringToU8a, u8aToHex, hexToU8a } = require("@polkadot/util");
const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed,
  schnorrkelVerify
} = require("@polkadot/util-crypto");
const doughnutMaker = require("./");
const {
  objectToCertificateU8a,
  certificateObjToSnakeCase
} = require("./generate/doughnut/certificateMappers");
const Doughnut = require("./doughnut");
const { createCompact } = require("./generate/doughnut/compactMappers");
const compactPrefix = require("./generate/doughnut/compactPrefix");

let issuerKeyPair;
let holderKeyPair;
let doughnut;
const expiry = 5555;
const notBefore = 1234;
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
    notBefore,
    permissions
  );
});

describe("when generating doughnut", () => {
  it("should be an instance of Doughnut", () => {
    expect(doughnut).toBeInstanceOf(Doughnut);
  });

  test("doughnut should be made from certificate and signature", () => {
    const { certificate, signature } = doughnut.toJSON();

    const certificateObjAsSnakeCase = certificateObjToSnakeCase(certificate);
    const certificateU8a = objectToCertificateU8a(certificateObjAsSnakeCase);

    const signatureU8a = hexToU8a(signature);
    const expectedDoughnut = new Doughnut(
      createCompact(compactPrefix, certificateU8a, signatureU8a)
    );

    expect(doughnut).toEqual(expectedDoughnut);
  });

  it("should return the correct certificate", () => {
    const { certificate } = doughnut.toJSON();

    const expectedcertificateObj = {
      issuer: issuerKeyPair.publicKey,
      holder: holderKeyPair.publicKey,
      expiry,
      notBefore,
      permissions,
      version: 0
    };

    expect(certificate).toEqual(expectedcertificateObj);
  });

  it("should return the correct signature", () => {
    // assuming that the certificate is correct from above
    const { certificate, signature } = doughnut.toJSON();
    const certificateObjAsSnakeCase = certificateObjToSnakeCase(certificate);
    const signatureU8a = hexToU8a(signature);

    const certificateU8a = objectToCertificateU8a(certificateObjAsSnakeCase);
    expect(
      schnorrkelVerify(certificateU8a, signatureU8a, issuerKeyPair.publicKey)
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
          notBefore,
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
          notBefore,
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
          notBefore,
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
          notBefore,
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
          notBefore,
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
          notBefore,
          permissions
        )
      ).toThrow("Input HolderPublicKey should be a UInt8Array of length 32");
    });

    it("should throw if notBefore not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          expiry,
          "",
          permissions
        )
      ).toThrow("Input notBefore should be unix timestamp number");
    });

    it("should throw if expiry not a number", () => {
      expect(() =>
        doughnutMaker.generate.doughnut(
          issuerKeyPair,
          holderKeyPair.publicKey,
          "",
          notBefore,
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
          notBefore,
          () => {}
        )
      ).toThrow("Input permissions should be an object");
    });
  });
});
