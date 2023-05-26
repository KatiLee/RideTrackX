'use strict';

function handle404(req, res, next) {
  const errorObject = {
    status: 404,
    message: 'Oh no! We cannot find what you are looking for.',
  };
  res.status(404).json(errorObject);
}

module.exports = handle404;