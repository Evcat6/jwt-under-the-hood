const base64Url = require("./base64url");
const crypto = require("crypto");

class JWT {
  static _algTypes = {
    HS256: "sha256",
    HS384: "sha384",
    HS512: "sha512",
  };

  static sign(payload, secret, config = { algorithm: "HS256" }) {
    const bodyPayload = {
      ...payload,
      iat: payload.iat ? payload.iat : Date.now(),
    };

    const headerPayload = {
      alg: config.algorithm,
      typ: "JWT",
    };

    const encodedHeader = base64Url.encode(JSON.stringify(headerPayload));
    const encodedBody = base64Url.encode(JSON.stringify(bodyPayload));
    return (
      encodedHeader +
      "." +
      encodedBody +
      "." +
      this._createSignature(
        `${encodedHeader}.${encodedBody}`,
        secret,
        headerPayload.alg
      )
    );
  }

  static _createSignature(data, key, algorithm) {
    const hmac = crypto.createHmac(this._algTypes[algorithm], key);

    hmac.update(data);

    return hmac.digest("base64url");
  }

  static verify(token, secret) {
    const [header, body, signature] = token.split(".");
    const { alg } = JSON.parse(base64Url.decode(header));
    const computedSignature = this._createSignature(
      `${header}.${body}`,
      secret,
      alg
    );

    if (computedSignature !== signature) {
      throw new Error("Invalid Signature");
    }

    return JSON.parse(base64Url.decode(body));
  }
}

module.exports = JWT;
