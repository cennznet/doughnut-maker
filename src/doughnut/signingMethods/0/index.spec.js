/*************************(
 * V0 Signing Method Test *
 **************************/
const signingMethod = require("./");

describe("Signing Method 0", () => {
  it("should separate cleanly", () => {
    const doughnut = new Uint8Array(65);

    const result = signingMethod.separate(doughnut)

    expect(result[0].length).toEqual(1);
    expect(result[1].length).toEqual(64);
  });
});

