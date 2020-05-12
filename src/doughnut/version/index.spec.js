/*************************
 * Version Encoding Test *
 *************************/
const versionEncoding = require("./");

describe("Version Encoding", () => {
  it("Version encodes as a LE u16", () => {
    const payloadVersion = 0x0a;
    const signingMethod = 0x05;

    const versionBinary =
      versionEncoding.encode(
        payloadVersion,
        signingMethod
    );

    expect(versionBinary).toEqual(new Uint8Array([0x0a, 0x05 << 3]));
  });

  it("should generate and separate cleanly", () => {
    const payloadVersion = 2000;
    const signingMethod = 25;

    const versionBinary =
      versionEncoding.encode(
        payloadVersion,
        signingMethod
    );

    const result = versionEncoding.separate(versionBinary);

    expect(result[0]).toEqual(payloadVersion);
    expect(result[1]).toEqual(signingMethod);
  });
});


