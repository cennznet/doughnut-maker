const { hexToU8a } = require("@polkadot/util");
const fromUint8Array = require("./fromUint8Array");
const { isEvenHex } = require("../../util");

const validate = compactHex => {
  if (!isEvenHex(compactHex)) {
    throw new Error(
      "Input value must be a compact encoded as a hex string of even length"
    );
  }
};

const generateDoughnutFromHex = compactHex => {
  validate(compactHex);

  return fromUint8Array(hexToU8a(compactHex));
};

module.exports = generateDoughnutFromHex;
