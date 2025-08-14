const { ZodError } = require('zod');

function validate({ body, query, params } = {}) {
  return (req, res, next) => {
    try {
      if (body)   req.body   = body.parse(req.body);
      if (query)  req.query  = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'ValidationError',
          issues: err.issues.map(i => ({ path: i.path.join('.'), message: i.message, code: i.code }))
        });
      }
      next(err);
    }
  };
}
module.exports = { validate };