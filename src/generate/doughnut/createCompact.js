const FULL_STOP_ASCII = 46;

const createCompact = (certificateU8a, signature) =>
  new Uint8Array([...certificateU8a, FULL_STOP_ASCII, ...signature]);

module.exports = createCompact;
