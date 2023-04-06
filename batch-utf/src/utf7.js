import { Buffer } from 'buffer';

function allocateAsciiBuffer(length) {
  return Buffer.alloc(length, 'ascii');
}

function encode(str) {
  const b = allocateAsciiBuffer(str.length * 2);
  for (let i = 0, bi = 0; i < str.length; i++) {
    // Note that we can't simply convert a UTF-8 string to Base64 because
    // UTF-8 uses a different encoding. In modified UTF-7, all characters
    // are represented by their two byte Unicode ID.
    const c = str.charCodeAt(i);
    // Upper 8 bits shifted into lower 8 bits so that they fit into 1 byte.
    b[bi++] = c >> 8;
    // Lower 8 bits. Cut off the upper 8 bits so that they fit into 1 byte.
    b[bi++] = c & 0xff;
  }
  // Modified Base64 uses , instead of / and omits trailing =.
  return b.toString('base64').replace(/=+$/, '');
}

function allocateBase64Buffer(str) {
  return Buffer.from(str, 'base64');
}

function decode(str) {
  const b = allocateBase64Buffer(str);
  const r = [];
  for (let i = 0; i < b.length; ) {
    // Calculate charcode from two adjacent bytes.
    r.push(String.fromCharCode((b[i++] << 8) | b[i++]));
  }
  return r.join('');
}

// Escape RegEx from http://simonwillison.net/2006/Jan/20/escape/
function escape(chars) {
  return chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Character classes defined by RFC 2152.
const setD = `A-Za-z0-9${escape("'(),-./:?")}`;
const setO = escape('!"#$%&*;<=>@[]^_\'{|}');
const setW = escape(' \r\n\t');

// Stores compiled regexes for various replacement pattern.
const regexes = {};
const regexAll = new RegExp(`[^${setW}${setD}${setO}]+`, 'g');

// RFC 2152 UTF-7 encoding with all optionals.
export function encodeAll(str) {
  // We replace subsequent disallowed chars with their escape sequence.
  return str.replace(regexAll, (chunk) => {
    // + is represented by an empty sequence +-, otherwise call encode().
    return `+${chunk === '+' ? '' : encode(chunk)}-`;
  });
}

// RFC 2152 UTF-7 encoding.
export function utf7Encode(str, mask) {
  // Generate a RegExp object from the string of mask characters.
  if (!mask) {
    mask = '';
  }
  if (!regexes[mask]) {
    regexes[mask] = new RegExp(`[^${setD}${escape(mask)}]+`, 'g');
  }

  // We replace subsequent disallowed chars with their escape sequence.
  return str.replace(regexes[mask], (chunk) => {
    // + is represented by an empty sequence +-, otherwise call encode().
    return `+${chunk === '+' ? '' : encode(chunk)}-`;
  });
}

// RFC 3501, section 5.1.3 UTF-7 encoding.
export function imapEncode(str) {
  // All printable ASCII chars except for & must be represented by themselves.
  // We replace subsequent non-representable chars with their escape sequence.
  return str.replace(/&/g, '&-').replace(/[^\u0020-\u007E]+/g, (chunk) => {
    // & is represented by an empty sequence &-, otherwise call encode().
    chunk = (chunk === '&' ? '' : encode(chunk)).replace(/\//g, ',');
    return `&${chunk}-`;
  });
}

// RFC 2152 UTF-7 decoding.
export function utf7Decode(str) {
  return str.replace(/\+([A-Za-z0-9\/]*)-?/gi, (_, chunk) => {
    // &- represents &.
    if (chunk === '') return '+';
    return decode(chunk);
  });
}

// RFC 3501, section 5.1.3 UTF-7 decoding.
export function imapDecode(str) {
  return str.replace(/&([^-]*)-/g, (_, chunk) => {
    // &- represents &.
    if (chunk === '') return '&';
    return decode(chunk.replace(/,/g, '/'));
  });
}
