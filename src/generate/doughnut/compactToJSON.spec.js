const compactToJSON = require("./compactToJSON");
const objectToCertificate = require("./objectToCertificate");

const FULL_STOP_ASCII = 46;

const certificateObject = { data: "here " };
const certificateUInt8Array = objectToCertificate(certificateObject);

describe("when using compactToJSON", () => {
  it("should return the certificate as an object and signature as UInt8Array", () => {
    const compact = new Uint8Array([
      ...certificateUInt8Array,
      FULL_STOP_ASCII,
      5,
      3,
      2,
      1
    ]);

    const result = compactToJSON(compact);

    const expected = {
      certificate: certificateObject,
      signature: new Uint8Array([5, 3, 2, 1])
    };

    expect(result).toEqual(expected);
  });
});
