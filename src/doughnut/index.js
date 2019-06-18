// Copyright 2019 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const payloadVersions = require('./payloadVersions');
const signingMethods = require('./signingMethods');
const version = require('./version');

const VERSION_BYTE_LENGTH = version.byteLength;

function generateDoughnut(
  payloadVersion,
  signingMethod,
  payload,
  signerKeyPair,
) {
  if (payloadVersions[payloadVersion] == null) {
    throw new Error('That payload version isn\'t supported.');
  }

  if (signingMethods[signingMethod] == null) {
    throw new Error('That signing method isn\'t supported.');
  }
  const encode = payloadVersions[payloadVersion].encode;
  const signature = signingMethods[signingMethod];
  const SIGNATURE_BYTE_LENGTH = signature.byteLength;

  // cursor, indicating current offset in doughnut
  let cursor = 0;

  const payloadBinary = encode(payload)

  // Uint8Array to hold doughnut
  const doughnutBinary = new Uint8Array(
    payloadBinary.length +
    VERSION_BYTE_LENGTH +
    SIGNATURE_BYTE_LENGTH
  );

  // set version
  const versionBinay = version.encode(payloadVersion, signingMethod);
  doughnutBinary.set(versionBinay, cursor);
  cursor += VERSION_BYTE_LENGTH;

  // set payload
  doughnutBinary.set(payloadBinary, cursor);
  cursor += payloadBinary.length;

  // set signature
  const signatureBinary = signature.sign(
    doughnutBinary.slice(0, cursor),
    signerKeyPair
  );
  doughnutBinary.set(signatureBinary, cursor);
  cursor += SIGNATURE_BYTE_LENGTH;

  return doughnutBinary;
}

function verifyDoughnut(doughnut) {
  if (!(doughnut instanceof Uint8Array)) {
    throw new Error("Input should be a Uint8Array");
  }

  // separate and decode the version
  const [payloadVersion, signingMethod, payloadAndSigBinary] =
    version.separate(doughnut)

  // validate the version numbers
  if (payloadVersions[payloadVersion] == null) {
    throw new Error('That payload version isn\'t supported.');
  }
  if (signingMethods[signingMethod] == null) {
    throw new Error('That signing method isn\'t supported.');
  }

  // get relevant payload version and signing method
  const signature = signingMethods[signingMethod];
  const decode = payloadVersions[payloadVersion].decode;

  // separate the signature from the payload
  const [payloadBinary, signatureBinary] =
    signature.separate(payloadAndSigBinary);

  // decode the payload
  const decodedDoughnut = decode(payloadBinary);

  const issuerValid = signature.verify(
    signature.separate(doughnut)[0],
    signatureBinary,
    decodedDoughnut.issuer
  );

  if (!issuerValid) {
    throw new Error(
      "The Doughnut issuer and signature do not match."
    );
  }

  return decodedDoughnut;
}

module.exports = {
  generate: generateDoughnut,
  verify: verifyDoughnut,
};
