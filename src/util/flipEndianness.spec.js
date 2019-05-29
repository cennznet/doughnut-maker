const flipEndianness = require("./flipEndianness");

describe("when flipping the endianness of a single number", () => {
  it("should flip endianess with bit representation", () => {
    let input = 0b101000;
    let result = flipEndianness(input);

    let expected = 0b10100;
    expect(result).toEqual(expected);
  });

  it("should flip endianess with bit ", () => {
    const input = 0b100;
    const result = flipEndianness(input);

    const expected = 0b100000;
    expect(result).toEqual(expected);
  });
});
