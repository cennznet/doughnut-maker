const { stringToU8a } = require("@polkadot/util");
const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed
} = require("@polkadot/util-crypto");
const sdk = require("./index");
const Doughnut = require("./doughnut");

const ONE_YEAR_IN_SECONDS = 31557600;

let issuerKeyPair;
let holderKeyPair;
let doughnut;

beforeAll(async () => {
  await cryptoWaitReady();

  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );

  const currentTimeInSecs = Date.now() / 1000;
  const expiry = currentTimeInSecs + ONE_YEAR_IN_SECONDS;
  const notBefore = currentTimeInSecs - ONE_YEAR_IN_SECONDS;
  const permissions = {
    has: "permissions"
  };

  doughnut = sdk.generate.doughnut(
    issuerKeyPair,
    holderKeyPair.publicKey,
    expiry,
    notBefore,
    permissions
  );
});

describe("sdk sanity checks", () => {
  it("should be an instance of Doughnut", () => {
    expect(doughnut).toBeInstanceOf(Doughnut);
  });

  test("doughnut made from JSON should equal the same doughnut", () => {
    const fromJSON = sdk.generate.doughnutFrom.json(doughnut.toJSON());

    expect(fromJSON).toEqual(doughnut);
  });

  test("doughnut made from hex should equal the same doughnut", () => {
    const fromHex = sdk.generate.doughnutFrom.hex(doughnut.toHex());

    expect(fromHex).toEqual(doughnut);
  });

  test("doughnut made from u8a should equal the same doughnut", () => {
    const fromU8a = sdk.generate.doughnutFrom.u8a(doughnut);

    expect(fromU8a).toEqual(doughnut);
  });

  test("verify should pass", () => {
    expect(sdk.verify.doughnut(doughnut)).toEqual(true);
  });
});
