import { ImportClass, toHexString, UmbralType } from "../utils";
import { EncryptedDataHex } from "./EncryptedDataHex";

export class EncryptedData {
  constructor(
    public capsule: ImportClass<UmbralType, 'Capsule'>,
    public ciphertext: Uint8Array,
    public signingKey: ImportClass<UmbralType, 'SecretKey'>,
    public verifyKey: ImportClass<UmbralType, 'PublicKey'>,
    public delegatingPubKey: ImportClass<UmbralType, 'PublicKey'>,
    public receivingPubKey: ImportClass<UmbralType, 'PublicKey'>,
    public nonce: number,
    public kfrags: any[]
  ) {}

  toHex() {
    const newKfrags: string[] = [];
    this.kfrags.forEach((el) => {
      newKfrags.push(toHexString(el.toBytes()));
    });

    return new EncryptedDataHex(
      toHexString(this.capsule.toBytes()),
      toHexString(this.ciphertext),
      toHexString(this.signingKey.toSecretBytes()),
      toHexString(this.verifyKey.toBytes()),
      toHexString(this.delegatingPubKey.toBytes()),
      toHexString(this.receivingPubKey.toBytes()),
      this.nonce,
      newKfrags
    );
  }
}

