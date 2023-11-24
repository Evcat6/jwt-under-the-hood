
JWT UNDER THE HOOD

External technologies used:
* crypto (for signature signing)

[base64url.js](./base64url.js) - used for decoding/encoding ASCII text to base64url text, you can do this using btoa/abtoa but this is too easy and will not show how works encoding/decoding really.

[JWT.js](./JWT.js) - here is declared `JWT` class who has two public methods verify and sign very close to [jsonwebtoken from npm](https://www.npmjs.com/package/jsonwebtoken)


Enjoy :)
