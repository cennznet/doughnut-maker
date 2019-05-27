const verifyDoughnut = require("./verifyDoughnut");
const {
  schnorrkelSign,
  schnorrkelKeypairFromSeed,
  cryptoWaitReady
} = require("@polkadot/util-crypto");
const { stringToU8a } = require("@polkadot/util");
const {
  objectToCertificateU8a
} = require("../generate/doughnut/certificateMappers");
const { createCompact } = require("../generate/doughnut/compactMappers");
const Doughnut = require("../doughnut");
const compactPrefix = require("../generate/doughnut/compactPrefix");
const { SIGNATURE_LENGTH } = require("../constants");

const ONE_YEAR_IN_SECONDS = 31557600;

let issuerKeyPair;
let holderKeyPair;
let certificateObj;
let currentTimeInSecs;

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
});

currentTimeInSecs = Date.now() / 1000;
beforeEach(() => {
  certificateObj = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: currentTimeInSecs + ONE_YEAR_IN_SECONDS,
    not_before: currentTimeInSecs - ONE_YEAR_IN_SECONDS,
    permissions: { data: "here" },
    version: 0
  };
});

describe("when verifying doughnuts", () => {
  it("should return true for a valid doughnut", () => {
    const certificateU8a = objectToCertificateU8a(certificateObj);
    const signature = schnorrkelSign(certificateU8a, issuerKeyPair);

    const doughnut = new Doughnut(
      createCompact(compactPrefix, certificateU8a, signature)
    );

    expect(verifyDoughnut(doughnut)).toEqual(true);
  });

  it("should return false if input not a doughnut", () => {
    const fakeDoughnut = new Uint8Array([1, 2, 3, 4]);

    expect(verifyDoughnut(fakeDoughnut)).toEqual(false);
  });

  it("should return false if incorrect signature", () => {
    const certificateU8a = objectToCertificateU8a(certificateObj);
    const signature = new Uint8Array(SIGNATURE_LENGTH);

    const doughnut = new Doughnut(
      createCompact(compactPrefix, certificateU8a, signature)
    );

    expect(verifyDoughnut(doughnut)).toEqual(false);
  });

  it("should return false if not_before greater than than current time", () => {
    certificateObj.not_before = currentTimeInSecs + ONE_YEAR_IN_SECONDS;
    const certificateU8a = objectToCertificateU8a(certificateObj);
    const signature = schnorrkelSign(certificateU8a, issuerKeyPair);

    const doughnut = new Doughnut(
      createCompact(compactPrefix, certificateU8a, signature)
    );

    expect(verifyDoughnut(doughnut)).toEqual(false);
  });

  it("should return false if expiry less than current time", () => {
    certificateObj.expiry = currentTimeInSecs - ONE_YEAR_IN_SECONDS;
    const certificateU8a = objectToCertificateU8a(certificateObj);
    const signature = schnorrkelSign(certificateU8a, issuerKeyPair);

    const doughnut = new Doughnut(
      createCompact(compactPrefix, certificateU8a, signature)
    );

    expect(verifyDoughnut(doughnut)).toEqual(false);
  });
});
