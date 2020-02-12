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
let doughnutJSON;
let doughnutJSONWithNotBefore;
let doughnutJSONWithZeroNotBefore;

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
      something: new Uint8Array([234, 111, 4, 186]),
      somethingElse: new Uint8Array([35, 231, 113, 42])
    }
  };

  doughnutJSONWithNotBefore = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    notBefore: 1234,
    permissions: {
      something: new Uint8Array([234, 111, 4, 186]),
      somethingElse: new Uint8Array([35, 231, 113, 42])
    }
  };

  doughnutJSONWithZeroNotBefore = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    notBefore: 0,
    permissions: {
      something: new Uint8Array([234, 111, 4, 186]),
      somethingElse: new Uint8Array([35, 231, 113, 42])
    }
  };

});



/*********
 * Tests *
 *********/

describe("Payload Version 0", () => {
  it("should encode and decode a valid doughnut payload with NotBefore unspecified", () => {
    const source = doughnutJSON;
    const doughnut = payloadVersion.encode(source);
    const decode = payloadVersion.decode(doughnut);

    expect(decode.issuer).toEqual(source.issuer);
    expect(decode.holder).toEqual(source.holder);
    expect(decode.expiry).toEqual(source.expiry);
    expect(decode.notBefore).toEqual(0);
    expect(decode.permissions).toEqual(source.permissions);
    // Not before bit is unset
    expect(doughnut[0] & (1 << 7)).toEqual(0);
  });

  it("should encode and decode a valid doughnut payload with NotBefore specified", () => {
    const source = doughnutJSONWithNotBefore;
    const doughnut = payloadVersion.encode(source);
    const decode = payloadVersion.decode(doughnut);

    expect(decode.issuer).toEqual(source.issuer);
    expect(decode.holder).toEqual(source.holder);
    expect(decode.expiry).toEqual(source.expiry);
    expect(decode.notBefore).toEqual(source.notBefore);
    expect(decode.permissions).toEqual(source.permissions);
  });

  it("should not encode an explicit zero NotBefore", () => {
    const source = doughnutJSONWithZeroNotBefore;
    const doughnut = payloadVersion.encode(source);
    const decode = payloadVersion.decode(doughnut);

    expect(decode.issuer).toEqual(source.issuer);
    expect(decode.holder).toEqual(source.holder);
    expect(decode.expiry).toEqual(source.expiry);
    expect(decode.notBefore).toEqual(source.notBefore);
    expect(decode.permissions).toEqual(source.permissions);
    // Not before bit is unset
    expect(doughnut[0] & (1 << 7)).toEqual(0);
  });
});

