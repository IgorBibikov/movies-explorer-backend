const http2 = require('node:http2');

const { HTTP_STATUS_CONFLICT } = http2.constants;

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictErr;
