import HttpError from "./HttpError.js";


const validateBody = (schema) => {
  const func = (req, _, next) => {

    const message = "Body must have at least one field"
    if (!Object.keys(req.body).length) next(HttpError(400, message));

    const { error } = schema.validate(req.body);
    if (error) next(HttpError(400, error.message));
    next();
  };

  return func;
};

export default validateBody;
