const isObject = value => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

module.exports = isObject;
