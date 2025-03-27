import { Error } from "mongoose";

class Errorhandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server message";
  err.statusCode = err.statusCode || 500;
  //it will show database error like when user not enter unique email
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Enterd`;
    err = new Errorhandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "jsonwebtoken is invalid, try again";
    err = new Errorhandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const messsage = "jsonwebtoken is Expired, try again";
    err = new Errorhandler(message, 400);
  }
  //it wiil occure when we try to enter wrong data type
  if (err.name === "CastError") {
    const messsage = `Invalid ${err.path}`;
    err = new Errorhandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(",")
    : err.message;
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default Errorhandler;
