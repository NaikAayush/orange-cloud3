/* tslint:disable */
/* eslint-disable */
/**
* @param {PublicKey} delegating_pk
* @param {Uint8Array} plaintext
* @returns {EncryptionResult}
*/
export function encrypt(delegating_pk: PublicKey, plaintext: Uint8Array): EncryptionResult;
/**
* @param {SecretKey} delegating_sk
* @param {Capsule} capsule
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptOriginal(delegating_sk: SecretKey, capsule: Capsule, ciphertext: Uint8Array): Uint8Array;
/**
* @param {SecretKey} delegating_sk
* @param {PublicKey} receiving_pk
* @param {Signer} signer
* @param {number} threshold
* @param {number} shares
* @param {boolean} sign_delegating_key
* @param {boolean} sign_receiving_key
* @returns {any[]}
*/
export function generateKFrags(delegating_sk: SecretKey, receiving_pk: PublicKey, signer: Signer, threshold: number, shares: number, sign_delegating_key: boolean, sign_receiving_key: boolean): any[];
/**
* @param {Capsule} capsule
* @param {VerifiedKeyFrag} kfrag
* @returns {VerifiedCapsuleFrag}
*/
export function reencrypt(capsule: Capsule, kfrag: VerifiedKeyFrag): VerifiedCapsuleFrag;
/**
*/
export class Capsule {
  free(): void;
/**
* @param {VerifiedCapsuleFrag} cfrag
* @returns {CapsuleWithFrags}
*/
  withCFrag(cfrag: VerifiedCapsuleFrag): CapsuleWithFrags;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Capsule}
*/
  static fromBytes(data: Uint8Array): Capsule;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {Capsule} other
* @returns {boolean}
*/
  equals(other: Capsule): boolean;
}
/**
*/
export class CapsuleFrag {
  free(): void;
/**
* @param {Capsule} capsule
* @param {PublicKey} verifying_pk
* @param {PublicKey} delegating_pk
* @param {PublicKey} receiving_pk
* @returns {VerifiedCapsuleFrag}
*/
  verify(capsule: Capsule, verifying_pk: PublicKey, delegating_pk: PublicKey, receiving_pk: PublicKey): VerifiedCapsuleFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {CapsuleFrag}
*/
  static fromBytes(data: Uint8Array): CapsuleFrag;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {CapsuleFrag} other
* @returns {boolean}
*/
  equals(other: CapsuleFrag): boolean;
}
/**
*/
export class CapsuleWithFrags {
  free(): void;
/**
* @param {VerifiedCapsuleFrag} cfrag
* @returns {CapsuleWithFrags}
*/
  withCFrag(cfrag: VerifiedCapsuleFrag): CapsuleWithFrags;
/**
* @param {SecretKey} receiving_sk
* @param {PublicKey} delegating_pk
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
  decryptReencrypted(receiving_sk: SecretKey, delegating_pk: PublicKey, ciphertext: Uint8Array): Uint8Array;
}
/**
*/
export class EncryptionResult {
  free(): void;
/**
*/
  capsule: Capsule;
/**
* @returns {Uint8Array}
*/
  readonly ciphertext: Uint8Array;
}
/**
*/
export class KeyFrag {
  free(): void;
/**
* @param {PublicKey} verifying_pk
* @returns {VerifiedKeyFrag}
*/
  verify(verifying_pk: PublicKey): VerifiedKeyFrag;
/**
* @param {PublicKey} verifying_pk
* @param {PublicKey} delegating_pk
* @returns {VerifiedKeyFrag}
*/
  verifyWithDelegatingKey(verifying_pk: PublicKey, delegating_pk: PublicKey): VerifiedKeyFrag;
/**
* @param {PublicKey} verifying_pk
* @param {PublicKey} receiving_pk
* @returns {VerifiedKeyFrag}
*/
  verifyWithReceivingKey(verifying_pk: PublicKey, receiving_pk: PublicKey): VerifiedKeyFrag;
/**
* @param {PublicKey} verifying_pk
* @param {PublicKey} delegating_pk
* @param {PublicKey} receiving_pk
* @returns {VerifiedKeyFrag}
*/
  verifyWithDelegatingAndReceivingKeys(verifying_pk: PublicKey, delegating_pk: PublicKey, receiving_pk: PublicKey): VerifiedKeyFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {KeyFrag}
*/
  static fromBytes(data: Uint8Array): KeyFrag;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {KeyFrag} other
* @returns {boolean}
*/
  equals(other: KeyFrag): boolean;
}
/**
*/
export class PublicKey {
  free(): void;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {PublicKey}
*/
  static fromBytes(data: Uint8Array): PublicKey;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {PublicKey} other
* @returns {boolean}
*/
  equals(other: PublicKey): boolean;
}
/**
*/
export class SecretKey {
  free(): void;
/**
* Generates a secret key using the default RNG and returns it.
* @returns {SecretKey}
*/
  static random(): SecretKey;
/**
* Generates a secret key using the default RNG and returns it.
* @returns {PublicKey}
*/
  publicKey(): PublicKey;
/**
* @returns {Uint8Array}
*/
  toSecretBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {SecretKey}
*/
  static fromBytes(data: Uint8Array): SecretKey;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class SecretKeyFactory {
  free(): void;
/**
* Generates a secret key factory using the default RNG and returns it.
* @returns {SecretKeyFactory}
*/
  static random(): SecretKeyFactory;
/**
* @returns {number}
*/
  static seedSize(): number;
/**
* @param {Uint8Array} seed
* @returns {SecretKeyFactory}
*/
  static fromSecureRandomness(seed: Uint8Array): SecretKeyFactory;
/**
* @param {Uint8Array} label
* @returns {SecretKey}
*/
  makeKey(label: Uint8Array): SecretKey;
/**
* @param {Uint8Array} label
* @returns {SecretKeyFactory}
*/
  makeFactory(label: Uint8Array): SecretKeyFactory;
/**
* @returns {Uint8Array}
*/
  toSecretBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {SecretKeyFactory}
*/
  static fromBytes(data: Uint8Array): SecretKeyFactory;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class Signature {
  free(): void;
/**
* @param {PublicKey} verifying_pk
* @param {Uint8Array} message
* @returns {boolean}
*/
  verify(verifying_pk: PublicKey, message: Uint8Array): boolean;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Signature}
*/
  static fromBytes(data: Uint8Array): Signature;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {Signature} other
* @returns {boolean}
*/
  equals(other: Signature): boolean;
}
/**
*/
export class Signer {
  free(): void;
/**
* @param {SecretKey} secret_key
*/
  constructor(secret_key: SecretKey);
/**
* @param {Uint8Array} message
* @returns {Signature}
*/
  sign(message: Uint8Array): Signature;
/**
* @returns {PublicKey}
*/
  verifyingKey(): PublicKey;
/**
* @returns {string}
*/
  toString(): string;
}
/**
*/
export class VerifiedCapsuleFrag {
  free(): void;
/**
* @param {Uint8Array} bytes
* @returns {VerifiedCapsuleFrag}
*/
  static fromVerifiedBytes(bytes: Uint8Array): VerifiedCapsuleFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {VerifiedCapsuleFrag} other
* @returns {boolean}
*/
  equals(other: VerifiedCapsuleFrag): boolean;
}
/**
*/
export class VerifiedKeyFrag {
  free(): void;
/**
* @param {Uint8Array} bytes
* @returns {VerifiedKeyFrag}
*/
  static fromVerifiedBytes(bytes: Uint8Array): VerifiedKeyFrag;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @returns {string}
*/
  toString(): string;
/**
* @param {VerifiedKeyFrag} other
* @returns {boolean}
*/
  equals(other: VerifiedKeyFrag): boolean;
}
