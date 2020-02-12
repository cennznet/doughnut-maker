/***********************
 * V0 Payload Encoding *
 ***********************/
const PUBLIC_KEY_BYTE_LENGTH = 32;
const TIMESTAMP_BYTE_LENGTH = 4;
const DOMAIN_NAME_BYTE_LENGTH = 16;
const DOMAIN_LENGTH_BYTE_LENGTH = 2;
const DOMAIN_LENGTHS_LIST_ITEM_BYTE_LENGTH =
  DOMAIN_NAME_BYTE_LENGTH + DOMAIN_LENGTH_BYTE_LENGTH;
const MAX_TIMESTAMP = 4294967295;
const MAX_PAYLOAD_BYTE_LENGTH = 65535;
const PAYLOAD_METADATA_LENGTH_WITH_NOTBEFORE = 73;
const PAYLOAD_METADATA_LENGTH_WITHOUT_NOTBEFORE = 69;

const {
  stringToU8a,
} = require("@polkadot/util");
const {
  isObject,
  flipEndianness,
  numberToLEBytes,
  LEBytesToNumber,
  getStringFromU8a,
} = require("@plugnet/binary-encoding-utilities");

function getPayloadMetadataLength(hasNotBefore) {
  return (
    (hasNotBefore) ?
      PAYLOAD_METADATA_LENGTH_WITH_NOTBEFORE :
      PAYLOAD_METADATA_LENGTH_WITHOUT_NOTBEFORE
  );
}

/* Verify JSON structure is valid for this version */
function verifyJSON(certificate) {
  if (!isObject(certificate)) {
    throw new Error("Input should be a certificate object");
  }
  const {
    issuer,
    holder,
    expiry,
    notBefore,
    permissions
  } = certificate;

  if (!(issuer instanceof Uint8Array) || issuer.length !== 32) {
    throw new Error(
      "Doughnut should have property issuer that is a Uint8Array of length 32"
    );
  }

  if (!(holder instanceof Uint8Array) || holder.length !== 32) {
    throw new Error(
      "Doughnut should have property holder that is a Uint8Array of length 32"
    );
  }

  if (typeof expiry !== "number") {
    throw new Error(
      "Doughnut should have property expiry that is a unix timestamp number"
    );
  }
  if (expiry > MAX_TIMESTAMP) {
    throw new Error(
      `Expiry cannot be greater than ${MAX_TIMESTAMP}`
    );
  }

  // optional notBefore field
  if (notBefore != null) {
    if(typeof notBefore !== "number") {
      throw new Error(
        "Doughnut should have property notBefore that is a unix timestamp number"
      );
    }
    if (notBefore > MAX_TIMESTAMP) {
      throw new Error(
        `NotBefore cannot be greater than ${MAX_TIMESTAMP}`
      );
    }
  }

  if (!isObject(permissions)) {
    throw new Error(
      "Doughnut should have property permissions that is an object"
    );
  }

  const objectKeys = Object.keys(permissions);
  if (objectKeys < 1) {
    throw new Error(
      "Doughnut must have at least one permission domain"
    );
  }
  if (objectKeys > 128) {
    throw new Error(
      "Doughnut may not have more than 128 permission domains"
    );
  }

  objectKeys.forEach((key) => {
    if (key.length > 16) {
      throw new Error(
        "Doughnut permission domain names cannot be longer than 16 characters"
      );
    }

    if (!(holder instanceof Uint8Array)) {
      throw new Error(
        "Doughnut permission domain values must be Uint8Arrays"
      );
    }

    if (holder.length > MAX_PAYLOAD_BYTE_LENGTH) {
      throw new Error(
        `Doughnut permission domain value cannot be longer than ${MAX_PAYLOAD_BYTE_LENGTH}`
      );
    }
  })
}

function encode(doughnutJSON) {
  verifyJSON(doughnutJSON)
  const {
    issuer,
    holder,
    expiry,
    notBefore,
    permissions
  } = doughnutJSON;

  const permissionKeys = Object.keys(permissions);
  const DOMAIN_COUNT = permissionKeys.length;
  const DOMAIN_LENGTHS_LIST_BYTE_LENGTH =
    DOMAIN_COUNT * DOMAIN_LENGTHS_LIST_ITEM_BYTE_LENGTH;

  let DOMAIN_PAYLOADS_LIST_BYTE_LENGTH = 0;
  permissionKeys.forEach((key) => {
    DOMAIN_PAYLOADS_LIST_BYTE_LENGTH += permissions[key].length;
  });

  const hasNotBefore = notBefore != null && notBefore > 0;

  const doughnutLength =
    getPayloadMetadataLength(hasNotBefore) +
    DOMAIN_LENGTHS_LIST_BYTE_LENGTH +
    DOMAIN_PAYLOADS_LIST_BYTE_LENGTH;

  const doughnut = new Uint8Array(doughnutLength);
  // 7bit LE permission domain count
  doughnut[0] = DOMAIN_COUNT - 1 // remove 1 to fit 128 in 7bit number
  doughnut[0] = doughnut[0] << 1
  doughnut[0] = flipEndianness(doughnut[0])

  // set the notBefore bit flag as needed
  if (hasNotBefore) {
    doughnut[0] |= (1 << 7);
  }

  // cursor, indicating current offset in Uint8Array
  let cursor = 1;

  // set issuer and holder addresses
  doughnut.set(issuer, cursor)
  cursor += PUBLIC_KEY_BYTE_LENGTH;
  doughnut.set(holder, cursor)
  cursor += PUBLIC_KEY_BYTE_LENGTH;

  // apply timestamps
  numberToLEBytes(expiry, doughnut, TIMESTAMP_BYTE_LENGTH, cursor)
  cursor += TIMESTAMP_BYTE_LENGTH;
  if (hasNotBefore) {
    numberToLEBytes(notBefore, doughnut, TIMESTAMP_BYTE_LENGTH, cursor)
    cursor += TIMESTAMP_BYTE_LENGTH;
  }

  // build permissions lists
  let payloadsCursor = cursor + DOMAIN_LENGTHS_LIST_BYTE_LENGTH;
  permissionKeys.forEach((key) => {
    const domainPayload = permissions[key];
    const domainPayloadLength = domainPayload.length;
    const binaryDomainKey = stringToU8a(key);

    doughnut.set(binaryDomainKey, cursor)
    cursor += DOMAIN_NAME_BYTE_LENGTH;

    numberToLEBytes(
      domainPayloadLength,
      doughnut,
      DOMAIN_LENGTH_BYTE_LENGTH,
      cursor
    );

    cursor += DOMAIN_LENGTH_BYTE_LENGTH;

    doughnut.set(domainPayload, payloadsCursor);
    payloadsCursor += domainPayloadLength;
  });

  return doughnut;
}

function decode(doughnut) {
  if (!(doughnut instanceof Uint8Array)) {
    throw new Error(
      "Tried to decode a doughnut that was not a Uint8Array"
    )
  }

  const hasNotBefore = ((doughnut[0] & (1 << 7)) != 0);
  const DOMAIN_COUNT = new Number(
    flipEndianness(
      (doughnut[0] << 1) & // shift over the hasNotBefore flag bit
      ~(1 << 8) // unset the 9th leftmost bit, as this is a 64bit number now
    )
  ) + 1;

  const PAYLOAD_METADATA_BYTE_LENGTH = getPayloadMetadataLength(hasNotBefore);
  const PAYLOAD_LENGTHS_BYTE_LENGTH = DOMAIN_LENGTHS_LIST_ITEM_BYTE_LENGTH * DOMAIN_COUNT;

  // cursor, indicating current offset in Uint8Array
  let cursor = 1;

  const issuer = doughnut.slice(cursor, cursor + PUBLIC_KEY_BYTE_LENGTH);
  cursor += PUBLIC_KEY_BYTE_LENGTH;
  const holder = doughnut.slice(cursor, cursor + PUBLIC_KEY_BYTE_LENGTH);
  cursor += PUBLIC_KEY_BYTE_LENGTH;

  const expiry = LEBytesToNumber(doughnut, TIMESTAMP_BYTE_LENGTH, cursor);
  let notBefore = 0;
  cursor += TIMESTAMP_BYTE_LENGTH;
  if (hasNotBefore) {
    notBefore = LEBytesToNumber(doughnut, TIMESTAMP_BYTE_LENGTH, cursor);
    cursor += TIMESTAMP_BYTE_LENGTH;
  }

  let permissions = {};
  let payloadCursor =
    PAYLOAD_METADATA_BYTE_LENGTH +
    PAYLOAD_LENGTHS_BYTE_LENGTH;
  for (
    let i = DOMAIN_COUNT;
    i > 0;
    i--
  ) {
    const domainName = getStringFromU8a(
      doughnut,
      DOMAIN_NAME_BYTE_LENGTH,
      cursor,
    )
    cursor += DOMAIN_NAME_BYTE_LENGTH;

    const payloadLength = LEBytesToNumber(doughnut, DOMAIN_LENGTH_BYTE_LENGTH, cursor);
    cursor += DOMAIN_LENGTH_BYTE_LENGTH;

    const payload = doughnut.slice(payloadCursor, payloadCursor + payloadLength);
    payloadCursor += payloadLength;

    permissions[domainName] = payload;
  }

  return {
    issuer,
    holder,
    notBefore,
    expiry,
    permissions,
  }
}

module.exports = {
  encode,
  decode,
}
