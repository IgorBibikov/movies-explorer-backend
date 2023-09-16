const http2 = require('node:http2');

const { HTTP_STATUS_BAD_REQUEST } = http2.constants;

class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestErr;
