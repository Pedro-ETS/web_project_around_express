const jwt = require('jsonwebtoken');
const { HttpStatus } = require("../enums/http");

const handleAuthError = (res) => {
  res
    .status(HttpStatus.FORBIDDEN)
    .send({ message: 'Error de autorización' });
};

const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  if (req.path === '/signup') {
    return next();
  }
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
};
