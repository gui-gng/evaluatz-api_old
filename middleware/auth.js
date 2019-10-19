const jwt = require("jsonwebtoken");
const Token = require("../auth/token");


module.exports = function(req, res, next) {

  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send({Error: "Access denied. No token provided."});

  try {
    var payload = Token.decode(token).payload;
    verifyOptions = {
        issuer: req.ip,
        subject: payload.sub,
        audience: payload.aud
    }
    //if can verify the token, set req.user and pass to next middleware
    const decoded = Token.verify(token, verifyOptions);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send({Error: "Invalid token."});
  }
};