export class EncryptedDataHex {
  constructor(
    public capsule: string,
    public ciphertext: string,
    public signingKey: string,
    public verifyKey: string,
    public delegatingPubKey: string,
    public receivingPubKey: string,
    public nonce: number,
    public kfrags: string[]
  ) {}
}
