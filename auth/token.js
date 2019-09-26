const fs   = require('fs');
const jwt   = require('jsonwebtoken');

// issuer — Software organization who issues the token.
// subject — Intended user of the token.
// audience — Basically identity of the intended recipient of the token..
// expiresIn — Expiration time after which the token will be invalid.
// algorithm — Encryption algorithm to be used to protect the token.

/*
   sOptions = {
    issuer: "Authorizaxtion/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }
  */

var privateKEY  = fs.readFileSync('./private.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.key', 'utf8');  

module.exports = {
 sign: (payload, $Options) => {

  var signOptions = {
      issuer:  $Options.issuer,
      subject:  $Options.subject,
      audience:  $Options.audience,
      expiresIn:  "1h",   
      algorithm:  "RS256"    
  };
  return jwt.sign(payload, privateKEY, signOptions);
},
verify: (token, $Option) => {

  var verifyOptions = {
      issuer:  $Option.issuer,
      subject:  $Option.subject,
      audience:  $Option.audience,
      expiresIn:  "1h",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}