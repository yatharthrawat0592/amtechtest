

/* using our own custom middleware function
 * middleware function used for handling request and response objects
 */
export const requestLogger = (request, response, next) => {
    console.log("Method:", request.method)
    console.log("Path:", request.path)
    console.log("Body:", request.body)
    console.log("---")
    /* next yields control to the next middleware */
    next()
  }


/* unknownEndpoint is added after all routing
 * used to catch requests made to non-existent routes
 */
export const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

/* express error handlers accept four parameters */
/* the execution order of middleware is the same that they are loaded
 * using app.use. Therefore this middleware appears at the end */
export const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    /* check is there is a CastError exception, which is caused by
   * an invalid object ID for Mongo */
    if (error.name === "CastError") {
      return response.status(400).send({ error: "Malformed ID" })
    } else if (error.name === "ValidationError") {
      /* add validation error handling */
      return response.status(400).json({ error: error.message })
    }
    next(error)
  }