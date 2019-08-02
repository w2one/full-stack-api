/**
 * https://github.com/auth0/node-jsonwebtoken
 */

import jwt from "jsonwebtoken";

export function encode(value) {
  return jwt.sign({ value }, "shhhhh");
}

export function decode(token) {
  return jwt.verify(token, "shhhhh", function(err, decoded) {
    // console.log(decoded); // bar
    return decoded;
  });
}

export function verify(token) {
  var decoded = jwt.verify(token, "shhhhh");
  console.log("xxxx", decoded); // bar
  console.log("xxxx", decoded.value); // bar

  return decoded;
}

// const token = encode({ id: 123 });

// console.log(token);

// const de = decode(token);

// console.log(de);

// console.log("------");
// console.log(verify(token));
