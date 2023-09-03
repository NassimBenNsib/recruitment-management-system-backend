export const requestValidator = (schema) => {
  return (request, response, next) => {
    try {
      if (schema) {
        schema.parse({
          body: request.body,
          query: request.query,
          params: request.params,
        });
      }
      next();
    } catch (error) {
      return response.status(400).send({
        type: "error",
        message: "Bad request",
        error: error,
      });
    }
  };
};
