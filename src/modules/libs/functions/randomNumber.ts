function randomNumber({ min, max, fixed = 0 }: RandomNumber) {
  if (fixed === 0) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else {
    return parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
  }
}

export default randomNumber;
