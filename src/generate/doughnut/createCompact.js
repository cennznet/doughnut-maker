const FULL_STOP_ASCII = 46;

const createCompact = (certificate, signature) =>
  new Uint8Array([...certificate, FULL_STOP_ASCII, ...signature]);

module.exports = createCompact;
