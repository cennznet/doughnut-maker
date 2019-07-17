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


async function generateDoughnut(
  payloadVersion,
  signigMethodID,
  payload,
  signerKeyPair,
) {
  if (payloadVersions[payloadVersion] == null) {
    throw new Error('That payload version isn\'t supported.');
  }

  if (signingMethods[signigMethodID] == null) {
    throw new Error('That signing method isn\'t supported.');
  }
  const encodePayload = payloadVersions[payloadVersion].encode;
  const signingMethod = signingMethods[signigMethodID];

  // generate the version bytes
  const versionBinary = version.encode(
    payloadVersion,
    signigMethodID,
  );

  // generate the payload bytes
  const payloadBinary = encodePayload(payload)

  // the versionAndPayload encoding cursor
  let versionAndPayloadCursor = 0;

  // allocate the message to be signed as Uint8Array
  const versionAndPayloadBinary =
    new Uint8Array(
      versionBinary.length +
      payloadBinary.length
    );

  // set the version
  versionAndPayloadBinary
    .set(versionBinary, versionAndPayloadCursor);
  versionAndPayloadCursor += versionBinary.length;

  // set the payload
  versionAndPayloadBinary
    .set(payloadBinary, versionAndPayloadCursor);
  versionAndPayloadCursor += payloadBinary.length;

  // generate the signature bytes
  const signatureBinary = await signingMethod.sign(
    versionAndPayloadBinary,
    signerKeyPair
  );

  // allocate the doughnut Uint8Array
  const doughnutBinary = new Uint8Array(
    versionAndPayloadBinary.length +
    signatureBinary.length
  );

  // the doughnut encoding cursor
  let doughnutCursor = 0;

  // set the versionAndPayloadBinary
  doughnutBinary.set(versionAndPayloadBinary, doughnutCursor);
  doughnutCursor += versionAndPayloadBinary.length;

  // set the signature
  doughnutBinary.set(signatureBinary, doughnutCursor);
  doughnutCursor += signatureBinary.length;

  return doughnutBinary;
}



function verifyDoughnut(doughnut) {
  if (!(doughnut instanceof Uint8Array)) {
    throw new Error("Input should be a Uint8Array");
  }

  // separate and decode the version
  const [payloadVersion, signingMethodID, payloadAndSigBinary] =
    version.separate(doughnut)

  // validate the version numbers
  if (payloadVersions[payloadVersion] == null) {
    throw new Error('That payload version isn\'t supported.');
  }
  if (signingMethods[signingMethodID] == null) {
    throw new Error('That signing method isn\'t supported.');
  }

  // get relevant payload version and signing method
  const signingMethod = signingMethods[signingMethodID];
  const decodePayload = payloadVersions[payloadVersion].decode;

  // separate the signature from the payload
  const [payloadBinary, signatureBinary] =
    signingMethod.separate(payloadAndSigBinary);

  // decode the payload
  const decodedDoughnut = decodePayload(payloadBinary);

  const issuerValid = signingMethod.verify(
    signingMethod.separate(doughnut)[0],
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
