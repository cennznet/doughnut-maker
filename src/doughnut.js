const u8aToHex = require("@cennznet/util");
const compactToJSON = require("./generate/doughnut/compactToJSON");

module.exports = class Doughnut extends Uint8Array {
  constructor(value) {
    super(value);
  }

  toHex() {
    return u8aToHex(this);
  }

  toJSON() {
    return compactToJSON(this);
  }
};
