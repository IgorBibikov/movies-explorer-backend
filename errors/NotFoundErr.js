const http2 = require('node:http2');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundErr;
