/****************************
 * V0 Payload Encoding Test *
 ****************************/
const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed
} = require("@polkadot/util-crypto");
const { stringToU8a } = require("@polkadot/util");

const payloadVersion = require("./");



/*********
 * Setup *
 *********/

let issuerKeyPair;
let holderKeyPair;
let v0DoughnutJSON;
let v0DoughnutJSONWithNotBefore;

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
  doughnutJSON = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    permissions: {
      something: new Uint8Array(1),
      somethingElse: new Uint8Array(1)
    }
  };

  doughnutJSONWithNotBefore = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    notBefore: 1234,
    permissions: {
      something: new Uint8Array(1),
      somethingElse: new Uint8Array(1)
    }
  };
});



/*********
 * Tests *
 *********/

describe("Payload Version 0", () => {
  it("should encode and decode a valid doughnut payload without NotBefore", () => {
    const source = doughnutJSON;
    const doughnut = payloadVersion.encode(source);
    const decode = payloadVersion.decode(doughnut);

    expect(decode.issuer).toEqual(source.issuer);
    expect(decode.holder).toEqual(source.holder);
    expect(decode.expiry).toEqual(source.expiry);
    expect(decode.notBefore).toEqual(source.notBefore);
    expect(decode.permissions).toEqual(source.permissions);
  });

  it("should encode and decode a valid doughnut payload with NotBefore", () => {
    const source = doughnutJSONWithNotBefore;
    const doughnut = payloadVersion.encode(source);
    const decode = payloadVersion.decode(doughnut);

    expect(decode.issuer).toEqual(source.issuer);
    expect(decode.holder).toEqual(source.holder);
    expect(decode.expiry).toEqual(source.expiry);
    expect(decode.notBefore).toEqual(source.notBefore);
    expect(decode.permissions).toEqual(source.permissions);
  });
});

