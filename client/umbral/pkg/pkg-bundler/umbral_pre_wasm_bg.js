import * as wasm from './umbral_pre_wasm_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {PublicKey} delegating_pk
* @param {Uint8Array} plaintext
* @returns {EncryptionResult}
*/
export function encrypt(delegating_pk, plaintext) {
    _assertClass(delegating_pk, PublicKey);
    var ptr0 = passArray8ToWasm0(plaintext, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.encrypt(delegating_pk.ptr, ptr0, len0);
    return EncryptionResult.__wrap(ret);
}

/**
* @param {SecretKey} delegating_sk
* @param {Capsule} capsule
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptOriginal(delegating_sk, capsule, ciphertext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_sk, SecretKey);
        _assertClass(capsule, Capsule);
        var ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.decryptOriginal(retptr, delegating_sk.ptr, capsule.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
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
export function generateKFrags(delegating_sk, receiving_pk, signer, threshold, shares, sign_delegating_key, sign_receiving_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_sk, SecretKey);
        _assertClass(receiving_pk, PublicKey);
        _assertClass(signer, Signer);
        wasm.generateKFrags(retptr, delegating_sk.ptr, receiving_pk.ptr, signer.ptr, threshold, shares, sign_delegating_key, sign_receiving_key);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {Capsule} capsule
* @param {VerifiedKeyFrag} kfrag
* @returns {VerifiedCapsuleFrag}
*/
export function reencrypt(capsule, kfrag) {
    _assertClass(capsule, Capsule);
    _assertClass(kfrag, VerifiedKeyFrag);
    var ret = wasm.reencrypt(capsule.ptr, kfrag.ptr);
    return VerifiedCapsuleFrag.__wrap(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export class Capsule {

    static __wrap(ptr) {
        const obj = Object.create(Capsule.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsule_free(ptr);
    }
    /**
    * @param {VerifiedCapsuleFrag} cfrag
    * @returns {CapsuleWithFrags}
    */
    withCFrag(cfrag) {
        _assertClass(cfrag, VerifiedCapsuleFrag);
        var ret = wasm.capsule_withCFrag(this.ptr, cfrag.ptr);
        return CapsuleWithFrags.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Capsule}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.capsule_fromBytes(ptr0, len0);
        return Capsule.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Capsule} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Capsule);
        var ret = wasm.capsule_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class CapsuleFrag {

    static __wrap(ptr) {
        const obj = Object.create(CapsuleFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsulefrag_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    * @returns {VerifiedCapsuleFrag}
    */
    verify(capsule, verifying_pk, delegating_pk, receiving_pk) {
        _assertClass(capsule, Capsule);
        _assertClass(verifying_pk, PublicKey);
        _assertClass(delegating_pk, PublicKey);
        _assertClass(receiving_pk, PublicKey);
        var ret = wasm.capsulefrag_verify(this.ptr, capsule.ptr, verifying_pk.ptr, delegating_pk.ptr, receiving_pk.ptr);
        return VerifiedCapsuleFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {CapsuleFrag}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.capsulefrag_fromBytes(ptr0, len0);
        return CapsuleFrag.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {CapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, CapsuleFrag);
        var ret = wasm.capsulefrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class CapsuleWithFrags {

    static __wrap(ptr) {
        const obj = Object.create(CapsuleWithFrags.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsulewithfrags_free(ptr);
    }
    /**
    * @param {VerifiedCapsuleFrag} cfrag
    * @returns {CapsuleWithFrags}
    */
    withCFrag(cfrag) {
        _assertClass(cfrag, VerifiedCapsuleFrag);
        var ret = wasm.capsulewithfrags_withCFrag(this.ptr, cfrag.ptr);
        return CapsuleWithFrags.__wrap(ret);
    }
    /**
    * @param {SecretKey} receiving_sk
    * @param {PublicKey} delegating_pk
    * @param {Uint8Array} ciphertext
    * @returns {Uint8Array}
    */
    decryptReencrypted(receiving_sk, delegating_pk, ciphertext) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(receiving_sk, SecretKey);
            _assertClass(delegating_pk, PublicKey);
            var ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.capsulewithfrags_decryptReencrypted(retptr, this.ptr, receiving_sk.ptr, delegating_pk.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class EncryptionResult {

    static __wrap(ptr) {
        const obj = Object.create(EncryptionResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionresult_free(ptr);
    }
    /**
    */
    get capsule() {
        var ret = wasm.__wbg_get_encryptionresult_capsule(this.ptr);
        return Capsule.__wrap(ret);
    }
    /**
    * @param {Capsule} arg0
    */
    set capsule(arg0) {
        _assertClass(arg0, Capsule);
        var ptr0 = arg0.ptr;
        arg0.ptr = 0;
        wasm.__wbg_set_encryptionresult_capsule(this.ptr, ptr0);
    }
    /**
    * @returns {Uint8Array}
    */
    get ciphertext() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.encryptionresult_ciphertext(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class KeyFrag {

    static __wrap(ptr) {
        const obj = Object.create(KeyFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keyfrag_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @returns {VerifiedKeyFrag}
    */
    verify(verifying_pk) {
        _assertClass(verifying_pk, PublicKey);
        var ret = wasm.keyfrag_verify(this.ptr, verifying_pk.ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @returns {VerifiedKeyFrag}
    */
    verifyWithDelegatingKey(verifying_pk, delegating_pk) {
        _assertClass(verifying_pk, PublicKey);
        _assertClass(delegating_pk, PublicKey);
        var ret = wasm.keyfrag_verifyWithDelegatingKey(this.ptr, verifying_pk.ptr, delegating_pk.ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} receiving_pk
    * @returns {VerifiedKeyFrag}
    */
    verifyWithReceivingKey(verifying_pk, receiving_pk) {
        _assertClass(verifying_pk, PublicKey);
        _assertClass(receiving_pk, PublicKey);
        var ret = wasm.keyfrag_verifyWithReceivingKey(this.ptr, verifying_pk.ptr, receiving_pk.ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    * @returns {VerifiedKeyFrag}
    */
    verifyWithDelegatingAndReceivingKeys(verifying_pk, delegating_pk, receiving_pk) {
        _assertClass(verifying_pk, PublicKey);
        _assertClass(delegating_pk, PublicKey);
        _assertClass(receiving_pk, PublicKey);
        var ret = wasm.keyfrag_verifyWithDelegatingAndReceivingKeys(this.ptr, verifying_pk.ptr, delegating_pk.ptr, receiving_pk.ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {KeyFrag}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.keyfrag_fromBytes(ptr0, len0);
        return KeyFrag.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {KeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, KeyFrag);
        var ret = wasm.keyfrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class PublicKey {

    static __wrap(ptr) {
        const obj = Object.create(PublicKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {PublicKey}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.publickey_fromBytes(ptr0, len0);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {PublicKey} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, PublicKey);
        var ret = wasm.publickey_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class SecretKey {

    static __wrap(ptr) {
        const obj = Object.create(SecretKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkey_free(ptr);
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {SecretKey}
    */
    static random() {
        var ret = wasm.secretkey_random();
        return SecretKey.__wrap(ret);
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {PublicKey}
    */
    publicKey() {
        var ret = wasm.secretkey_publicKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toSecretBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toSecretBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {SecretKey}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkey_fromBytes(ptr0, len0);
        return SecretKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class SecretKeyFactory {

    static __wrap(ptr) {
        const obj = Object.create(SecretKeyFactory.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkeyfactory_free(ptr);
    }
    /**
    * Generates a secret key factory using the default RNG and returns it.
    * @returns {SecretKeyFactory}
    */
    static random() {
        var ret = wasm.secretkeyfactory_random();
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    static seedSize() {
        var ret = wasm.secretkeyfactory_seedSize();
        return ret >>> 0;
    }
    /**
    * @param {Uint8Array} seed
    * @returns {SecretKeyFactory}
    */
    static fromSecureRandomness(seed) {
        var ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkeyfactory_fromSecureRandomness(ptr0, len0);
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKey}
    */
    makeKey(label) {
        var ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkeyfactory_makeKey(this.ptr, ptr0, len0);
        return SecretKey.__wrap(ret);
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKeyFactory}
    */
    makeFactory(label) {
        var ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkeyfactory_makeFactory(this.ptr, ptr0, len0);
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toSecretBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkeyfactory_toSecretBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {SecretKeyFactory}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkeyfactory_fromBytes(ptr0, len0);
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkeyfactory_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Signature {

    static __wrap(ptr) {
        const obj = Object.create(Signature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signature_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {Uint8Array} message
    * @returns {boolean}
    */
    verify(verifying_pk, message) {
        _assertClass(verifying_pk, PublicKey);
        var ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.signature_verify(this.ptr, verifying_pk.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Signature}
    */
    static fromBytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.signature_fromBytes(ptr0, len0);
        return Signature.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Signature} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Signature);
        var ret = wasm.signature_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class Signer {

    static __wrap(ptr) {
        const obj = Object.create(Signer.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signer_free(ptr);
    }
    /**
    * @param {SecretKey} secret_key
    */
    constructor(secret_key) {
        _assertClass(secret_key, SecretKey);
        var ret = wasm.signer_new(secret_key.ptr);
        return Signer.__wrap(ret);
    }
    /**
    * @param {Uint8Array} message
    * @returns {Signature}
    */
    sign(message) {
        var ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.signer_sign(this.ptr, ptr0, len0);
        return Signature.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    verifyingKey() {
        var ret = wasm.signer_verifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signer_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class VerifiedCapsuleFrag {

    static __wrap(ptr) {
        const obj = Object.create(VerifiedCapsuleFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedcapsulefrag_free(ptr);
    }
    /**
    * @param {Uint8Array} bytes
    * @returns {VerifiedCapsuleFrag}
    */
    static fromVerifiedBytes(bytes) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.verifiedcapsulefrag_fromVerifiedBytes(ptr0, len0);
        return VerifiedCapsuleFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {VerifiedCapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedCapsuleFrag);
        var ret = wasm.capsulefrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class VerifiedKeyFrag {

    static __wrap(ptr) {
        const obj = Object.create(VerifiedKeyFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedkeyfrag_free(ptr);
    }
    /**
    * @param {Uint8Array} bytes
    * @returns {VerifiedKeyFrag}
    */
    static fromVerifiedBytes(bytes) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.verifiedkeyfrag_fromVerifiedBytes(ptr0, len0);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {VerifiedKeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedKeyFrag);
        var ret = wasm.keyfrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}

export function __wbg_verifiedkeyfrag_new(arg0) {
    var ret = VerifiedKeyFrag.__wrap(arg0);
    return addHeapObject(ret);
};

export function __wbg_randomFillSync_64cc7d048f228ca8() { return handleError(function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
}, arguments) };

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbg_getRandomValues_98117e9a7e993920() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

export function __wbg_process_2f24d6544ea7b200(arg0) {
    var ret = getObject(arg0).process;
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_versions_6164651e75405d4a(arg0) {
    var ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

export function __wbg_node_4b517d861cbcb3bc(arg0) {
    var ret = getObject(arg0).node;
    return addHeapObject(ret);
};

export function __wbindgen_is_string(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export function __wbg_crypto_98fc271021c7d2ad(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export function __wbg_msCrypto_a2cdb043d2bfe57f(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export function __wbg_modulerequire_3440a4bcf44437db() { return handleError(function (arg0, arg1) {
    var ret = module.require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newnoargs_be86524d73f67598(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_call_888d259a5fefc347() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbg_new_342a24ca698edd87(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbg_self_c6fbdfc2918d5e58() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_baec038b5ab35c54() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_3f735a5746d41fbd() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_1bc0b39582740e95() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_buffer_397eaa4d72ee94dd(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_new_a7ce447f15ff496f(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_set_969ad0a60e51d320(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export function __wbg_length_1eb8fc608a0d4cdb(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export function __wbg_newwithlength_929232475839a482(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_subarray_8b658422a224f479(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_rethrow(arg0) {
    throw takeObject(arg0);
};

export function __wbindgen_memory() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

