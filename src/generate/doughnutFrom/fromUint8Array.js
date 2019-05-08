const Doughnut = require("../../doughnut");

const validate = compactU8a => {
  if (!(compactU8a instanceof Uint8Array)) {
    throw new Error("Input value must be a compact of uInt8Array");
  }
};

const generateDoughnutFromUInt8Array = compactU8a => {
  validate(compactU8a);
  const doughnut = new Doughnut(compactU8a);

  return doughnut;
};

module.exports = generateDoughnutFromUInt8Array;
