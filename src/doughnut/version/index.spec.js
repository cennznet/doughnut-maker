/*************************
 * Version Encoding Test *
 *************************/
const versionEncoding = require("./");

describe("Version Encoding", () => {
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


