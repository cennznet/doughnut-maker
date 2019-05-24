const { hexToU8a } = require("@polkadot/util");
const { hex } = require("./index");
const Doughnut = require("../../doughnut");

describe("when generating doughnut from hex", () => {
  it("should return a Doughnut with the hex converted as the compact", () => {
    const compactHex = "0x1234";
    const result = hex(compactHex);

    const expectedU8a = hexToU8a(compactHex);
    const expectedDoughnut = new Doughnut(expectedU8a);
    expect(result).toEqual(expectedDoughnut);
  });

  it("should throw if not a string", () => {
    expect(() => hex(1234)).toThrow(
      "Input value must be a compact encoded as a hex string of even length"
    );
  });

  it("should throw if string but not hex", () => {
    expect(() => hex("compactHex")).toThrow(
      "Input value must be a compact encoded as a hex string of even length"
    );
  });

  it("should throw if hex string of odd length", () => {
    expect(() => hex("0x123")).toThrow(
      "Input value must be a compact encoded as a hex string of even length"
    );
  });
});
