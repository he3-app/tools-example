import forge from 'node-forge';

export interface Option {
  keySize: 1024 | 2048 | 4096;
  privateKeyFormat: 'OpenSSH' | 'Putty' | 'Pem';
  publicKeyFormat: 'OpenSSH' | 'Pem';
  passphrase?: string;
  privateKeyComment?: string;
  publicKeyComment?: string;
  pemCharPerLine?: number;
}

export interface RSAKeyPair {
  privateKey: string;
  publicKey: string;
}

export async function generateRSAKeyPair(options: Option): Promise<RSAKeyPair> {
  const kp = forge.pki.rsa.generateKeyPair({
    bits: options.keySize,
    workers: 2,
  });
  const res: RSAKeyPair = { privateKey: '', publicKey: '' };

  switch (options.privateKeyFormat) {
    case 'OpenSSH':
      res.privateKey = forge.ssh.privateKeyToOpenSSH(kp.privateKey, options.passphrase);
      break;
    case 'Putty':
      res.privateKey = forge.ssh.privateKeyToPutty(
        kp.privateKey,
        options.passphrase,
        options.privateKeyComment
      );
      break;
    case 'Pem':
      if (options.passphrase !== '') {
        res.privateKey = forge.pki.encryptRsaPrivateKey(kp.privateKey, options.passphrase);
      } else {
        res.privateKey = forge.pki.privateKeyToPem(kp.privateKey, options.pemCharPerLine);
      }
      break;
  }

  switch (options.publicKeyFormat) {
    case 'OpenSSH':
      res.publicKey = forge.ssh.publicKeyToOpenSSH(kp.publicKey, options.publicKeyComment);
      break;
    case 'Pem':
      res.publicKey = forge.pki.publicKeyToRSAPublicKeyPem(kp.publicKey, options.pemCharPerLine);
      break;
  }

  return res;
}

export async function getRSAPublicKeyFromPrivateKey(
  privateKey: string,
  passphrase?: string
): Promise<string> {
  let res = '';
  try {
    const pri = forge.pki.decryptRsaPrivateKey(privateKey, passphrase);
    const pub = forge.pki.setRsaPublicKey(pri.n, pri.e);
    res = formatPemPublicKey(pub);
  } catch {
    return Promise.reject('Failed to decrypt the private key. Please check your passphrase.');
  }
  return res;
}
function formatPemPublicKey(privateKey) {
  return forge.pki.publicKeyToRSAPublicKeyPem(privateKey, 72);
}
