const { PREFIX_LENGTH, SIGNATURE_LENGTH } = require("../../constants");

const createCompact = (prefixU8a, certificateU8a, signatureU8a) =>
  new Uint8Array([...prefixU8a, ...certificateU8a, ...signatureU8a]);

const destructureCompact = compact => {
  const prefixU8a = compact.slice(0, PREFIX_LENGTH);

  const certificateLength = compact.length - PREFIX_LENGTH - SIGNATURE_LENGTH;
  const certificateU8a = compact.slice(PREFIX_LENGTH, certificateLength + 1);
  const signatureU8a = compact.slice(PREFIX_LENGTH + certificateLength);

  return { prefixU8a, certificateU8a, signatureU8a };
};

module.exports = { createCompact, destructureCompact };
