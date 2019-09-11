# Doughnut Maker
_Patent Pending_

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

### `generateDoughnut`

Create a new Doughnut certificate, in binary encoding.

The payload version chosen dictates the schema of `payloadObject`.
The signing method chosen dictates the schema of `signerKeyPair`.
Read more about [payload versions and signing methods](https://github.com/cennznet/doughnut-paper/blob/master/format.md).

```
async generateDoughnut(
  payloadVersion,     // Payload version - unsigned integer
  signingMethod,      // Signing method - unsigned integer
  payloadObject,      // A JSON Object describing the payload contents - schema dictated by payload version
  signerKeyPair,      // A signing keypair required by the the signing method
) -> Promise<Uint8Array>
```

### `verifyDoughnut`

Check a Doughnut certificate's validity and return the JSON representation.

```
async verifyDoughnut(
	doughnut: Uint8Array
) -> Promise<Object> // returns a DoughnutJSONObject if valid
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

async sign (
    message: Uint8Array,
    signer: Uint8Array,
) -> Promise<Uint8Array>

async verify (
    message,
    signature,
    signerPrivateKey
) -> Promise<Boolean>

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
