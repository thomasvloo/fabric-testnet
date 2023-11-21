// ********** Imports **********
const express = require("express");

// ********** Functions **********
/**
 * Error handling middleware for Express applications.
 * This middleware is used to catch errors in the application and send a uniform error response.
 *
 * @param err - The error object that has been passed to this middleware.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the Express app’s request-response cycle.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

// ********** Exports **********
module.exports = {
    errorHandler,
};
