/*************************(
 * V1 Signing Method Test *
 **************************/
const signingMethod = require("./");

const { stringToU8a } = require("@polkadot/util");
const {
  naclKeypairFromSeed,
} = require("@polkadot/util-crypto");


describe("Signing Method 1", () => {
  let signer;

  beforeAll(() => {
    signer = naclKeypairFromSeed(
      stringToU8a("cennznetjstest".padEnd(32, " "))
    );
  });

  it("should create a valid v1 signature", () => {
    const payload = [0,1,2,3,4,5,6,7,8];
    const message = new Uint8Array(payload);

    const signature = signingMethod.sign(
      message,
      signer,
    );

    const concated = new Uint8Array(
      message.length + signature.length
    );
    concated.set(message, 0);
    concated.set(signature, message.length);

    const [m, s] = signingMethod.separate(concated);

    const valid = signingMethod.verify(
      m,
      s,
      signer.publicKey,
    );

    expect(valid).toBe(true);
  });

  it("should separate cleanly", () => {
    const doughnut = new Uint8Array(65);

    const result = signingMethod.separate(doughnut)

    expect(result[0].length).toEqual(1);
    expect(result[1].length).toEqual(64);
  });
});

