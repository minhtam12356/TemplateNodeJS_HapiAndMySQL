const en = require('../assets/locales/en.js');
const vn = require('../assets/locales/en.js');

class Error {
  constructor(language) {
    if (language === 'vn') {
      this.lg = vn;
    } else {
      this.lg = en;
    }
    this.statusCodes = [
      { success: true, statusCode: 200, message: 'success' },
      { success: true, statusCode: 201, message: 'success' },
      { success: false, statusCode: 400, message: 'badRequest' },
      { success: false, statusCode: 404, message: 'endpointNotFound' },
      { success: false, statusCode: 500, message: 'internalError' }
    ];
  }

  getError(statusCode) {
    const error = this.statusCodes.find(vl => {
      return statusCode === vl.statusCode;
    });
    if (!error) return null;
    return {
      success: error.success,
      statusCode,
      message: this.lg[error.message]
    };
  }

  getStatusCodeMessage(statusCode) {
    const code = this.statusCodes.find(vl => {
      return statusCode === vl.statusCode;
    });
    if (!code) return '';
    return this.lg[code.message];
  }
}

module.exports = Error;
