# Doughnut Maker

The Doughnut Maker generates, validates, and unpacks [Doughnut certificates](https://github.com/cennznet/doughnut-paper).

## Installing

This package is not yet in the NPM registry, but you may still install it via npm:

```
npm install --save cennznet/doughnut-maker
```

## Development

Run tests:
```
npm test
```

Run lint:
```
npm run lint
```

## API

```
Interface {
	generate: generateDoughnut,
	verify: verifyDoughnut
}
```

### Doughnut JSON Object

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

### `generateDoughnut`

Create a new Doughnut certificate, in binary encoding.

Read more about [payload versions and signing methods](https://github.com/cennznet/doughnut-paper/blob/master/format.md).

```
generateDoughnut(
  payloadVersion,     // Payload version, currently 0
  signingMethod,      // Signing method, currently 0
  doughnutJSONObject, // The Doughnut JSON Object described above
  signerKeyPair,      // A Schorrkel keypair, as specified by the polkadot crypto utils
) -> Uint8Array
```

### `verifyDoughnut`

Check a Doughnut certificate's validity and return the JSON representation.

```
verifyDoughnut(
	doughnut: Uint8Array
) -> Object // returns a DoughnutJSONObject if valid
```




## Adding a Signing Method

A signing method is a small module that determines how a signature is created, verified and separated.

The official signing methods and their IDs may be seen [here](https://github.com/cennznet/doughnut-paper/blob/master/format.md#signature).

There are three high-level steps involved in creating a new signing method.

### 1. Add

Add a new module to the `src/doughnut/signingMethods/` directory, named as the signing method's identifier number

The interface for a signing module is assumed to be:

```
{
    sign,
    verify,
    separate
}

sign (
    message: Uint8Array,
    signer: Uint8Array,
) -> Uint8Array

verify (
    message,
    signature,
    signerPrivateKey
) -> Boolean

separate (
    doughnut
) -> {
    payload: Uint8Array,
    signature: Uint8Array
}
```

Any errors are to be raised via `throw`.


### 2. Test

Add tests to verify that the sign and verify methods work together,
and that the separate method will detach the signature correctly

Tests are written with `jest`, and will be descovered when they follow the `*.spec.js` naming convention.

### 3. Link

The module must be exposed in the `src/doughnut/signingMethods/index.js`
file to be recognised by the `doughnut-maker`.

Make sure that the module is exposed under the correct signing method id.





## Adding a Payload Version

A payload version encoder is a module that encodes and decodes a doughnut payload of a particular version to its binary format and back.

The official payload version formats may be seen [here](https://github.com/cennznet/doughnut-paper/blob/master/format.md#payload).

There are three high-level steps involved in creating a new payload version encoder.

### 1. Add

Add a new module to the `src/doughnut/payloadVersions/` directory, named as the payload version

The interface for a payload version encoder is assumed to be:

```
{
    encode,
    decode
}

encode (
    payload: Any
) -> Uint8Array

decode (
    Uint8Array
) -> Any

```

Note that the encode method is expected to validate the payload given to it, to determine whether
it represents a valid doughnut of that version.

Any errors are to be raised via `throw`.


### 2. Test

Add tests to verify that the encode and decode methods work together.

Tests are written with `jest`, and will be descovered when they follow the `*.spec.js` naming convention.

### 3. Link

The module must be exposed in the `src/doughnut/payloadVersions/index.js`
file to be recognised by the `doughnut-maker`.

Make sure that the module is exposed under the correct payload version.
