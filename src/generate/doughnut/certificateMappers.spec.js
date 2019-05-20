const { stringToU8a } = require("@polkadot/util");
const btoa = require("btoa");
const {
  objectToCertificateU8a,
  certificateU8aToObject,
  certificateObjToCamelCase,
  certificateObjToSnakeCase
} = require("./certificateMappers");

const certificateObjSnake = {
  issuer: new Uint8Array([1, 2, 3, 4, 5, 6]),
  holder: new Uint8Array([9, 8, 7, 6, 5]),
  expiry: 555,
  not_before: 654321,
  permissions: {
    myPermissions: true
  },
  version: 0
};

const certificateObjCamel = {
  issuer: new Uint8Array([1, 2, 3, 4, 5, 6]),
  holder: new Uint8Array([9, 8, 7, 6, 5]),
  expiry: 555,
  notBefore: 654321,
  permissions: {
    myPermissions: true
  },
  version: 0
};

describe("when using objectToCertificateU8a", () => {
  it("should return the correct u8a", () => {
    const result = objectToCertificateU8a(certificateObjSnake);

    const expected = stringToU8a(btoa(JSON.stringify(certificateObjSnake)));

    expect(result).toEqual(expected);
  });
});

describe("when using certificateU8aToObject", () => {
  it("should convert back to the original object", () => {
    const certificateU8a = objectToCertificateU8a(certificateObjSnake);
    const result = certificateU8aToObject(certificateU8a);

    expect(result).toEqual(certificateObjSnake);
  });
});

describe("when using certificateObjectToCamelCase", () => {
  it("should return a new object with camelCase", () => {
    const result = certificateObjToCamelCase(certificateObjSnake);

    const expected = {
      issuer: certificateObjSnake.issuer,
      holder: certificateObjSnake.holder,
      expiry: certificateObjSnake.expiry,
      notBefore: certificateObjSnake.not_before,
      permissions: certificateObjSnake.permissions,
      version: certificateObjSnake.version
    };
    expect(result).toEqual(expected);
  });

  it("should maintain the same order of keys and values", () => {
    const result = certificateObjToCamelCase(certificateObjSnake);

    const expected = {
      issuer: certificateObjSnake.issuer,
      holder: certificateObjSnake.holder,
      expiry: certificateObjSnake.expiry,
      notBefore: certificateObjSnake.not_before,
      permissions: certificateObjSnake.permissions,
      version: certificateObjSnake.version
    };
    const resultKeys = Object.keys(result);
    const resultValues = Object.values(result);
    const expectedKeys = Object.keys(expected);
    const expectedValues = Object.values(expected);

    expect(resultKeys).toEqual(expectedKeys);
    expect(resultValues).toEqual(expectedValues);
  });
});

describe("when using certificateObjectToSnakeCase", () => {
  it("should return a new object with snake case", () => {
    const result = certificateObjToSnakeCase(certificateObjCamel);

    const expected = {
      issuer: certificateObjCamel.issuer,
      holder: certificateObjCamel.holder,
      expiry: certificateObjCamel.expiry,
      not_before: certificateObjCamel.notBefore,
      permissions: certificateObjCamel.permissions,
      version: certificateObjCamel.version
    };
    expect(result).toEqual(expected);
  });

  it("should maintain the same order of keys and values", () => {
    const result = certificateObjToSnakeCase(certificateObjCamel);

    const expected = {
      issuer: certificateObjCamel.issuer,
      holder: certificateObjCamel.holder,
      expiry: certificateObjCamel.expiry,
      not_before: certificateObjCamel.notBefore,
      permissions: certificateObjCamel.permissions,
      version: certificateObjCamel.version
    };
    const resultKeys = Object.keys(result);
    const resultValues = Object.values(result);
    const expectedKeys = Object.keys(expected);
    const expectedValues = Object.values(expected);

    expect(resultKeys).toEqual(expectedKeys);
    expect(resultValues).toEqual(expectedValues);
  });
});
