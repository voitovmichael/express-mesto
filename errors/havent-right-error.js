class RightError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

module.exports = RightError;
