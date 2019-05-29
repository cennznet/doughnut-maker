const flipU8aEndianness = require("./flipU8aEndianness");

describe("when flipping the endianness of a u8a", () => {
  it("should flip the byte order as well as the bit endianness", () => {
    const input = new Uint8Array([0b00000010, 0b00001000, 0b10000000]);
    const expected = new Uint8Array([0b00000001, 0b00010000, 0b01000000]);

    flipU8aEndianness(input);

    expect(input).toEqual(expected);
  });

  it("should flip a given window only", () => {
    const input    = new Uint8Array([0b00000010, 0b00001000, 0b10000000, 0b01010000, 0b00001111]);
    // index 2 and 3
    const expected = new Uint8Array([0b00000010, 0b00001000, 0b00001010, 0b00000001, 0b00001111]);

    flipU8aEndianness(input, 2, 2);

    expect(input).toEqual(expected);
  });
});
