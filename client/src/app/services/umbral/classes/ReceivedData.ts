import { fromHexString, ImportClass, UmbralType } from "../utils";

export class ReceivedDataHex {
  constructor(
    public receiverSecretKey: string,
    public senderPubKey: string,
    public senderVerifyKey: string,
    public data: Uint8Array,
    public capsule: string,
    public cfrags: string[]
  ) {}

  // returns ReceivedData with nice types
  getActual(umbral: UmbralType) {
    const receiverSecretKey = umbral.SecretKey.fromBytes(fromHexString(this.receiverSecretKey));
    const senderPubKey = umbral.PublicKey.fromBytes(fromHexString(this.senderPubKey));
    const senderVerifyKey = umbral.PublicKey.fromBytes(fromHexString(this.senderVerifyKey));

    const capsule = umbral.Capsule.fromBytes(fromHexString(this.capsule));
    const newCfrags: ImportClass<UmbralType, 'VerifiedCapsuleFrag'>[] = [];

    for (let i = 0; i < this.cfrags.length; ++i) {
      const cfrag = umbral.CapsuleFrag.fromBytes(fromHexString(this.cfrags[i]));

      const verifiedCfrag = cfrag.verify(capsule, senderVerifyKey, senderPubKey, receiverSecretKey.publicKey());

      newCfrags.push(verifiedCfrag);
    }

    return new ReceivedData(
      receiverSecretKey,
      senderPubKey,
      senderVerifyKey,
      this.data,
      capsule,
      newCfrags
    )
  }
}

export class ReceivedData {
  constructor(
    public receiverSecretKey: ImportClass<UmbralType, 'SecretKey'>,
    public senderPubKey: ImportClass<UmbralType, 'PublicKey'>,
    public senderVerifyKey: ImportClass<UmbralType, 'PublicKey'>,
    public data: Uint8Array,
    public capsule: ImportClass<UmbralType, 'Capsule'>,
    public cfrags: ImportClass<UmbralType, 'VerifiedCapsuleFrag'>[]
  ) {}
}

