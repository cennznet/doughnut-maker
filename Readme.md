# Doughnut Maker

The Doughnut maker generates and Validates, and unpacks Doughnut certificates.

## Installing

This package is not yet in the NPM registry, but you may still install it via npm:

```
npm install --save cennznet/doughnut-maker
```

## API

```
Interface {
	generate: generateDoughnut,
	verify verifyDoughnut
}
```

## `Doughnut` JSON Object

A JSON format that may be used to generate a Doughnut, and is returned by the verify function.

All public keys and keypairs are schnorrkel, preferrably generated by the [polkadot crypto utilities](https://polkadot.js.org/common/util-crypto/SUMMARY.html).

```
Object {
    issuer: Uint8Array, // Issuer Public Key
    holder: Uint8Array, // Holder Public Key
    expires: Number,    // UNIX timestamp, in seconds
    notBefore: Number,  // OPTIONAL: UNIX timestamp, in seconds
    permissions: {      // Permissions domains. Must have at least one. No more than 128 in total.
        [domainName]: Uint8Array, // A Uint8Array no longer than 65,536 bytes
        ...
    }
}
```

## `generateDoughnut`

Create a new `Doughnut` certificate, in binary encoding.

Read more about [payload versions and signing methods](https://github.com/cennznet/doughnut-paper/blob/master/format.md).

```
generateDoughnut(
  payloadVersion,     // Payload version, currently 0
  signingMethod,      // Signing method, currently 0
  doughnutJSONObject, // The Doughnut JSON Object described above
  signerKeyPair,      // A Schorrkel keypair, as specified by the polkadot crypto utils
) -> Uint8Array
```

## `verifyDoughnut`

Check a `Doughnut` certificate's validity and return the JSON representation.

```
verifyDoughnut(
	doughnut: Uint8Array
) -> Object // returns a DoughnutJSONObject if valid
```
