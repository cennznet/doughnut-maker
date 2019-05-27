const Doughnut = require("../../doughnut");
const { u8a } = require("./index");

describe("when generating doughnut from uint8array", () => {
  it("should return a doughnut with the compact", () => {
    const compact = new Uint8Array([1, 2, 3, 4]);

    const result = u8a(compact);

    const expected = new Doughnut(compact);
    expect(result).toEqual(expected);
  });

  it("should throw if not a uInt8Array", () => {
    expect(() => u8a([1, 2, 3, 4])).toThrow(
      "Input value must be a compact of uInt8Array"
    );
  });
});
