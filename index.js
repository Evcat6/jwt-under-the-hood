const jwt = require("./JWT");

const secret = "some example secret";

const payload = {
    name: "Evcat6"
}

const token = jwt.sign(payload, secret, { algorithm: "HS384"});

console.log(token);

console.log(jwt.verify(token, secret));
