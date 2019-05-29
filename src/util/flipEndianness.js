const flip = (input, length = 8, index = 0) => {
  if (index === length) {
    return 0;
  }
  let output = flip(input, length, index + 1);

  const maskToCheck = 1 << index;
  const maskToFlip = 1 << (length - index - 1);

  const shouldFlip = input & maskToCheck;

  if (shouldFlip) {
    output = output | maskToFlip;
  }
  return output;
};

module.exports = flip;
