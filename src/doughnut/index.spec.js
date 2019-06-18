/****************************
 * Doughnut Generator Tests *
 ****************************/
const {
  cryptoWaitReady,
  schnorrkelKeypairFromSeed,
  naclKeypairFromSeed,
} = require("@polkadot/util-crypto");
const { stringToU8a } = require("@polkadot/util");

const doughnutSDK = require("./");


/*********
 * Setup *
 *********/

let issuerKeyPair;
let holderKeyPair;
let issuerKeyPairNacl;
let holderKeyPairNacl;
let v0DoughnutJSON;
let v0DoughnutJSONWithNotBefore;
let v0DoughnutJSONNacl;
let v0DoughnutJSONWithNotBeforeNacl;

beforeAll(async () => {
  await cryptoWaitReady();
  issuerKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPair = schnorrkelKeypairFromSeed(
    stringToU8a("holderkeypair".padEnd(32, " "))
  );
  issuerKeyPairNacl = naclKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
  holderKeyPairNacl = naclKeypairFromSeed(
    stringToU8a("cennznetjstest".padEnd(32, " "))
  );
});

beforeEach(() => {
  v0DoughnutJSON = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    permissions: {
      something: new Uint8Array(1),
      somethingElse: new Uint8Array(1)
    }
  };

  v0DoughnutJSONWithNotBefore = {
    issuer: issuerKeyPair.publicKey,
    holder: holderKeyPair.publicKey,
    expiry: 555555,
    notBefore: 1234,
    permissions: {
      something: new Uint8Array(1),
      somethingElse: new Uint8Array(1)
    }
  };

  v0DoughnutJSONNacl = {
    issuer: issuerKeyPairNacl.publicKey,
    holder: holderKeyPairNacl.publicKey,
    expiry: 555555,
    permissions: {
      something: new Uint8Array(1),
      somethingElse: new Uint8Array(1)
    }
  };

  v0DoughnutJSONWithNotBeforeNacl = {
    issuer: issuerKeyPairNacl.publicKey,
    holder: holderKeyPairNacl.publicKey,
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

describe("Generate Doughnut", () => {
  it("should generate a valid v0,s0 doughnut without a not before", () => {
    const payloadVersion = 0;
    const signingMethod = 0;

    const doughnut = doughnutSDK.generate(
      payloadVersion,
      signingMethod,
      v0DoughnutJSON,
      issuerKeyPair,
    );

    doughnutSDK.verify(doughnut)
  });


  it("should generate a valid v0,s0 doughnut with a not before", () => {
    const payloadVersion = 0;
    const signingMethod = 0;

    const doughnut = doughnutSDK.generate(
      payloadVersion,
      signingMethod,
      v0DoughnutJSONWithNotBefore,
      issuerKeyPair,
    );

    doughnutSDK.verify(doughnut)
  });


  it("should generate a valid v0,s1 doughnut without a not before", () => {
    const payloadVersion = 0;
    const signingMethod = 1;

    const doughnut = doughnutSDK.generate(
      payloadVersion,
      signingMethod,
      v0DoughnutJSONNacl,
      issuerKeyPairNacl,
    );

    doughnutSDK.verify(doughnut)
  });

  it("should generate a valid v0,s1 doughnut with a not before", () => {
    const payloadVersion = 0;
    const signingMethod = 1;

    const doughnut = doughnutSDK.generate(
      payloadVersion,
      signingMethod,
      v0DoughnutJSONWithNotBeforeNacl,
      issuerKeyPairNacl,
    );

    doughnutSDK.verify(doughnut)
  });
});


