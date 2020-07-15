const Boom = require('@hapi/boom');

function failValidateAction(request, h, err) {
  if (process.env.NODE_ENV === 'production') {
    throw Boom.badRequest(`Invalid request payload input`);
  } else {
    // throw err;
    return h
      .response({
        message: err.details[0].message.replace(/['"]+/g, ''),
        success: false,
        statusCode: 400
      })
      .code(400)
      .takeover();
  }
}

module.exports = { failValidateAction };
