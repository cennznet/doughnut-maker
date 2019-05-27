const { createCompact, destructureCompact } = require("./compactMappers");
const compactPrefix = require("../doughnut/compactPrefix");
const { SIGNATURE_LENGTH } = require("../../constants");

describe("when using createCompact", () => {
  it("should return the correct value", () => {
    const certificateU8a = new Uint8Array([1, 2, 3, 4]);
    const signature = new Uint8Array(SIGNATURE_LENGTH);
    const result = createCompact(compactPrefix, certificateU8a, signature);

    const expected = new Uint8Array([0, 0, ...certificateU8a, ...signature]);

    expect(result).toEqual(expected);
  });
});

describe("when using destructureCompact", () => {
  it("should return the prefixU8a, certificateU8a and signatureU8a in an object", () => {
    const signature = new Uint8Array(SIGNATURE_LENGTH);
    const compact = new Uint8Array([0, 0, 1, 2, 3, 4, ...signature]);

    const result = destructureCompact(compact);
    const expected = {
      prefixU8a: new Uint8Array([0, 0]),
      certificateU8a: new Uint8Array([1, 2, 3, 4]),
      signatureU8a: signature
    };

    expect(result).toEqual(expected);
  });
});
