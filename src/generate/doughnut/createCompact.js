const FULL_STOP_ASCII = 46;

const createCompact = (certificateU8a, signatureU8a) =>
  new Uint8Array([...certificateU8a, FULL_STOP_ASCII, ...signatureU8a]);

module.exports = createCompact;
