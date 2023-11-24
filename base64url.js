const asciiMap = {
  " ": "00100000",
  "!": "00100001",
  '"': "00100010",
  "#": "00100011",
  $: "00100100",
  "%": "00100101",
  "&": "00100110",
  "'": "00100111",
  "(": "00101000",
  ")": "00101001",
  "*": "00101010",
  "+": "00101011",
  ",": "00101100",
  "-": "00101101",
  ".": "00101110",
  "/": "00101111",
  0: "00110000",
  1: "00110001",
  2: "00110010",
  3: "00110011",
  4: "00110100",
  5: "00110101",
  6: "00110110",
  7: "00110111",
  8: "00111000",
  9: "00111001",
  ":": "00111010",
  ";": "00111011",
  "<": "00111100",
  "=": "00111101",
  ">": "00111110",
  "?": "00111111",
  "@": "01000000",
  A: "01000001",
  B: "01000010",
  C: "01000011",
  D: "01000100",
  E: "01000101",
  F: "01000110",
  G: "01000111",
  H: "01001000",
  I: "01001001",
  J: "01001010",
  K: "01001011",
  L: "01001100",
  M: "01001101",
  N: "01001110",
  O: "01001111",
  P: "01010000",
  Q: "01010001",
  R: "01010010",
  S: "01010011",
  T: "01010100",
  U: "01010101",
  V: "01010110",
  W: "01010111",
  X: "01011000",
  Y: "01011001",
  Z: "01011010",
  "[": "01011011",
  "\\": "01011100",
  "]": "01011101",
  "^": "01011110",
  _: "01011111",
  "`": "01100000",
  a: "01100001",
  b: "01100010",
  c: "01100011",
  d: "01100100",
  e: "01100101",
  f: "01100110",
  g: "01100111",
  h: "01101000",
  i: "01101001",
  j: "01101010",
  k: "01101011",
  l: "01101100",
  m: "01101101",
  n: "01101110",
  o: "01101111",
  p: "01110000",
  q: "01110001",
  r: "01110010",
  s: "01110011",
  t: "01110100",
  u: "01110101",
  v: "01110110",
  w: "01110111",
  x: "01111000",
  y: "01111001",
  z: "01111010",
  "{": "01111011",
  "|": "01111100",
  "}": "01111101",
  "~": "01111110",
};

const base64urlEncodingMap = {
  0: "A",
  17: "R",
  34: "i",
  51: "z",
  1: "B",
  18: "S",
  35: "j",
  52: "0",
  2: "C",
  19: "T",
  36: "k",
  53: "1",
  3: "D",
  20: "U",
  37: "l",
  54: "2",
  4: "E",
  21: "V",
  38: "m",
  55: "3",
  5: "F",
  22: "W",
  39: "n",
  56: "4",
  6: "G",
  23: "X",
  40: "o",
  57: "5",
  7: "H",
  24: "Y",
  41: "p",
  58: "6",
  8: "I",
  25: "Z",
  42: "q",
  59: "7",
  9: "J",
  26: "a",
  43: "r",
  60: "8",
  10: "K",
  27: "b",
  44: "s",
  61: "9",
  11: "L",
  28: "c",
  45: "t",
  62: "-",
  12: "M",
  29: "d",
  46: "u",
  63: "_",
  13: "N",
  30: "e",
  47: "v",
  14: "O",
  31: "f",
  48: "w",
  15: "P",
  32: "g",
  49: "x",
  16: "Q",
  33: "h",
  50: "y",
};

const asciiDecodingMap = Object.fromEntries(
  Object.entries(asciiMap).map((entry) => entry.reverse())
);

const base64urlDecodingMap = Object.fromEntries(
  Object.entries(base64urlEncodingMap).map((entry) => {
    entry[0] = Number(entry[0]);
    return entry.reverse();
  })
);

class Base64Url {
  static _parseASCIIToBinary(string) {
    let parsedString = "";
    for (let i = 0; i < string.length; i++) {
      parsedString += asciiMap[string[i]];
    }
    return this._fitBinary(parsedString);
  }

  static _parseBase64ToBinary(string) {
    let resBinary = "";
    for (let i = 0; i < string.length; i++) {
      resBinary += this._convertUnsignedIntToBinary(
        base64urlDecodingMap[string[i]],
        6
      );
    }
    return resBinary;
  }

  static _convertUnsignedBinaryToInt(binary) {
    let resInt = 0;
    for (let i = 0; i < binary.length; i++) {
      if (binary[binary.length - i - 1] == "1") {
        resInt += 2 ** i;
      }
    }
    return resInt;
  }

  static _convertUnsignedIntToBinary(integer, minFill = 4) {
    let resBinary = "";
    while (integer > 0) {
      resBinary += String(integer % 2);
      integer = ~~(integer / 2);
    }

    while (resBinary.length < minFill) {
      resBinary += "0";
    }

    return resBinary.split("").reverse().join("");
  }

  static _fitBinary(binary) {
    let fittedBinary = binary;
    const mod = binary.length % 3;
    for (let i = 0; i < mod; i++) {
      fittedBinary += "00000000";
    }
    return fittedBinary;
  }

  static _convertBinary(binary) {
    let base64URL = "";
    for (let i = 0; i < binary.length; i += 6) {
      const intValue = this._convertUnsignedBinaryToInt(
        binary.substring(i, i + 6)
      );
      base64URL += base64urlEncodingMap[intValue];
    }
    return base64URL;
  }

  static encode(string) {
    const parsedASCII = this._parseASCIIToBinary(string);

    return this._convertBinary(parsedASCII);
  }

  static decode(string) {
    const binary = this._parseBase64ToBinary(string);

    let ascii = "";

    for (let i = 0; i < binary.length; i += 8) {
      const asciiValue = asciiDecodingMap[binary.substring(i, i + 8)];

      if (asciiValue === undefined) {
        break;
      }
      
      ascii += asciiValue;
    }
    return ascii;
  }
}

module.exports = Base64Url;
