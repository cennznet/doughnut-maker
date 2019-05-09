const FULL_STOP_ASCII = 46;

const createCompact = (certificateU8a, signatureU8a) =>
  new Uint8Array([...certificateU8a, FULL_STOP_ASCII, ...signatureU8a]);

const destructureCompact = compact => {
  const fullStopIndex = compact.indexOf(FULL_STOP_ASCII);

  const certificateU8a = compact.slice(0, fullStopIndex);
  const signatureU8a = compact.slice(fullStopIndex + 1);

  return { certificateU8a, signatureU8a };
};

module.exports = { createCompact, destructureCompact };
