const { createCompact } = require("./compactMappers");

const FULL_STOP_ASCII = 46;

describe("when using createCompact", () => {
  it("should return the correct value", () => {
    const certificateU8a = new Uint8Array([1, 2, 3, 4]);
    const signature = new Uint8Array([4, 3, 2, 1]);

    const result = createCompact(certificateU8a, signature);

    const expected = new Uint8Array([1, 2, 3, 4, FULL_STOP_ASCII, 4, 3, 2, 1]);

    expect(result).toEqual(expected);
  });
});
