const Doughnut = require("../../doughnut");
const { fromUInt8Array } = require("./index");

describe("when generating doughnut from uint8array", () => {
  it("should return a doughnut with the compact", () => {
    const compact = new Uint8Array([1, 2, 3, 4]);

    const result = fromUInt8Array(compact);

    const expected = new Doughnut(compact);
    expect(result).toEqual(expected);
  });

  it("should throw if not a uInt8Array", () => {
    expect(() => fromUInt8Array([1, 2, 3, 4])).toThrow(
      "Input value must be a compact of uInt8Array"
    );
  });
});
