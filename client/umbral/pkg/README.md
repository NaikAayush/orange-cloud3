# JavaScript bindings for `umbral-pre`

[![npm package][js-npm-image]][js-npm-link] ![License][js-license-image]

This repo contains the WASM-based JS bindings for the [main Rust project][umbral-pre].

## Usage

(This code can be found in the `examples` folder)

```javascript
import * as umbral from "umbral-pre";

let enc = new TextEncoder();
let dec = new TextDecoder("utf-8");

// As in any public-key cryptosystem, users need a pair of public and private keys.
// Additionally, users that delegate access to their data (like Alice, in this example)
// need a signing keypair.

// Key Generation (on Alice's side)
let alice_sk = umbral.SecretKey.random();
let alice_pk = alice_sk.publicKey();
let signing_sk = umbral.SecretKey.random();
let signer = new umbral.Signer(signing_sk);
let verifying_pk = signing_sk.publicKey();

// Key Generation (on Bob's side)
let bob_sk = umbral.SecretKey.random();
let bob_pk = bob_sk.publicKey();

// Now let's encrypt data with Alice's public key.
// Invocation of `encrypt()` returns both the ciphertext and a capsule.
// Note that anyone with Alice's public key can perform this operation.

let plaintext = "Plaintext message";
let plaintext_bytes = enc.encode(plaintext);

// The API here slightly differs from that in Rust.
// Since wasm-pack does not support returning tuples, we return an object containing
// the ciphertext and the capsule.
let result = umbral.encrypt(alice_pk, plaintext_bytes);
let ciphertext = result.ciphertext;
let capsule = result.capsule;

// Since data was encrypted with Alice's public key, Alice can open the capsule
// and decrypt the ciphertext with her private key.

let plaintext_alice = umbral.decryptOriginal(alice_sk, capsule, ciphertext);
console.assert(dec.decode(plaintext_alice) === plaintext, "decryptOriginal() failed");

// When Alice wants to grant Bob access to open her encrypted messages,
// she creates re-encryption key fragments, or "kfrags", which are then
// sent to `shares` proxies or Ursulas.

let shares = 3; // how many fragments to create
let threshold = 2; // how many should be enough to decrypt
let kfrags = umbral.generateKFrags(
    alice_sk, bob_pk, signer, threshold, shares, true, true);

// Bob asks several Ursulas to re-encrypt the capsule so he can open it.
// Each Ursula performs re-encryption on the capsule using the kfrag provided by Alice,
// obtaining this way a "capsule fragment", or cfrag.

// Bob collects the resulting cfrags from several Ursulas.
// Bob must gather at least `threshold` cfrags in order to open the capsule.

// Ursula 0
let cfrag0 = umbral.reencrypt(capsule, kfrags[0]);

// Ursula 1
let cfrag1 = umbral.reencrypt(capsule, kfrags[1]);

// ...

// Finally, Bob opens the capsule by using at least `threshold` cfrags,
// and then decrypts the re-encrypted ciphertext.

// Another deviation from the Rust API.
// wasm-pack does not support taking arrays as arguments,
// so we build a capsule+cfrags object before decryption.
let plaintext_bob = capsule
    .withCFrag(cfrag0)
    .withCFrag(cfrag1)
    .decryptReencrypted(bob_sk, alice_pk, ciphertext);

console.assert(dec.decode(plaintext_bob) === plaintext, "decryptReencrypted() failed");
```

## Build

The package is built using [`wasm-pack`](https://github.com/rustwasm/wasm-pack).
Instead of running `wasm-build` directly, use the included `Makefile`, since it has to do some additional actions that `wasm-build` currently does not support:

```bash
$ make
```

## Running the examples

After you have successfully built the WASM package, run one of the example projects in the `examples` directory.


[js-npm-image]: https://img.shields.io/npm/v/umbral-pre
[js-npm-link]: https://www.npmjs.com/package/umbral-pre
[js-license-image]: https://img.shields.io/npm/l/umbral-pre
[umbral-pre]: https://github.com/nucypher/rust-umbral/tree/master/umbral-pre
