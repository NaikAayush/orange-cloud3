import * as bip32 from 'bip32';
import { EncryptedData } from './EncryptedData';
// TODO
import * as bip39 from 'bip39';
import {
  UmbralType,
  ImportClass,
  fromHexString,
  toHexString,
  typedArrayToBuffer,
} from '../utils';
import { ReceivedData } from './ReceivedData';

export class ProxyReEncryptionKey {
  log = true;
  umbral: UmbralType;

  // bip things
  private seed!: Buffer;
  private root!: bip32.BIP32Interface;
  private privateKeyHex!: string | undefined;

  // umbral things
  private secretKey!: ImportClass<UmbralType, 'SecretKey'>;
  public publicKey!: ImportClass<UmbralType, 'PublicKey'>;

  // umbral params
  // m out of n proxy re-encryption
  m = 2;
  n = 3;

  constructor(
    umbral: typeof import('umbral-pre'),
    privateKey: string | null = null,
    chaincode: Uint8Array | null = null
  ) {
    this.umbral = umbral;

    if (privateKey === null) {
      this.generateNewKey();
    } else {
      if (chaincode === null) {
        throw 'chaincode should be provided if pk is given';
      }
      this.privateKeyHex = privateKey;
      this.root = bip32.fromPrivateKey(
        Buffer.from(typedArrayToBuffer(fromHexString(this.privateKeyHex))),
        Buffer.from(typedArrayToBuffer(chaincode))
      );
    }

    if (this.privateKeyHex === undefined) {
      console.log("Could not load PRE keys! Private key is undefined.");
    } else {
      const secretKey = this.loadUmbralKeys(this.privateKeyHex);
      this.secretKey = secretKey;
      this.publicKey = secretKey.publicKey();
    }
  }

  // generates new mnenomic and stuff
  // mnenomic not stored, brr
  public generateNewKey() {
    const mnem = bip39.generateMnemonic();
    console.log(mnem);

    this.seed = bip39.mnemonicToSeedSync(mnem);
    this.root = bip32.fromSeed(this.seed);
    this.privateKeyHex = this.root.privateKey?.toString('hex');

    if (this.log) {
      console.log('Root', this.root);
      console.log('root.privatekey', this.root.privateKey);
      console.log('privatekey hex', this.privateKeyHex);
    }

    return this.privateKeyHex;
  }

  // load umbral secret key from hex
  public loadUmbralKeys(privateKeyHex: string) {
    const secretKey = this.umbral.SecretKey.fromBytes(
      fromHexString(privateKeyHex)
    );

    if (this.log) {
      const publicKey = secretKey.publicKey();
      console.log('secret key', secretKey.toString());
      console.log('secret key bytes', secretKey.toSecretBytes());
      console.log('secret key hex', this.privateKeyHex);
      console.log('public key', publicKey.toString());
      console.log('public key bytes', publicKey.toBytes());
      console.log('public key hex', toHexString(publicKey.toBytes()));
    }

    return secretKey;
  }

  // generates new umbral signing key
  // (NOT a Signer)
  public generateSigningKey(index: number) {
    const newRoot = this.root.derive(index);

    if (newRoot.privateKey === undefined) {
      throw ("Could not generate signing key! Private key is undefined");
    }

    const signKey = newRoot.privateKey.toString('hex');

    return this.loadUmbralKeys(signKey);
  }

  // display functions

  public getPubKeyHex() {
    return toHexString(this.publicKey.toBytes());
  }

  public getSecKeyHex() {
    return this.privateKeyHex;
  }

  // encrypt decrypt stuff here

  // number between 0 and 2**31-1
  private getRandomNonce() {
    const max = 2 ** 31 - 1;
    const min = 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public encryptLocalBytes(data: Uint8Array) {
    return this.umbral.encrypt(this.publicKey, data);
  }

  public encryptBytes(
    data: Uint8Array,
    receiverPubKey: ImportClass<UmbralType, 'PublicKey'>
  ) {
    const result = this.encryptLocalBytes(data);

    // generate signing keys
    const nonce = this.getRandomNonce();
    const signingKey = this.generateSigningKey(nonce);
    const verifyKey = signingKey.publicKey();
    const signer = new this.umbral.Signer(signingKey);

    // make key fragments
    const kfrags = this.umbral.generateKFrags(
      this.secretKey,
      receiverPubKey,
      signer,
      this.m,
      this.n,
      true,
      true
    );

    return new EncryptedData(
      result.capsule,
      result.ciphertext,
      signingKey,
      verifyKey,
      this.publicKey,
      receiverPubKey,
      nonce,
      kfrags
    );
  }

  public generateKFragsAndSignKeys(receiverPubKey: ImportClass<UmbralType, 'PublicKey'>, nonce: number) {
    const signingKey = this.generateSigningKey(nonce);
    const signer = new this.umbral.Signer(signingKey);
    const verifyKey = signingKey.publicKey();

    // make key fragments
    const kfrags = this.umbral.generateKFrags(
      this.secretKey,
      receiverPubKey,
      signer,
      this.m,
      this.n,
      true,
      true
    );

    return {
      kfrags,
      signingKey,
      signer,
      verifyKey
    }
  }

  public decrypt(data: ReceivedData) {
    // make CapsuleWithCfrag with one cfrag
    let capsule = data.capsule.withCFrag(data.cfrags[0]);

    // add all cfrags except first
    data.cfrags.slice(1).forEach((cfrag) => {
      capsule = capsule.withCFrag(cfrag);
    });

    const decryptedData = capsule.decryptReencrypted(
      data.receiverSecretKey,
      data.senderPubKey,
      data.data
    );

    return decryptedData;
  }
}

