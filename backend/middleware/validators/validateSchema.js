const validateSchema = (schema) => async (req, res, next) => {
  try {
    if (req.method === 'GET') {
      req.query = await schema.parseAsync(req.query);
    } else {
      req.body = await schema.parseAsync(req.body);
    }
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        message: 'Error de validación',
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

module.exports = validateSchema;