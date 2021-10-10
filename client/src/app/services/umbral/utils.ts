export type UmbralType = typeof import('umbral-pre');
export type ImportClass<T, K extends keyof T> = T extends Record<K, infer S>
  ? S extends new (...args: any[]) => infer R
    ? R
    : never
  : never;
export const fromHexString = (hexString: string) =>
  new Uint8Array((hexString.match(/.{1,2}/g) as RegExpMatchArray).map((byte) => parseInt(byte, 16)));

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}

