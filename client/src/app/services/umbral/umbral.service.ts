import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../auth/auth.service';
import { ProxyReEncryptionKey } from './classes/ProxyReEncryptionKey';
import { EncryptedData } from './classes/EncryptedData';
import { environment } from 'src/environments/environment';
import { fromHexString, toHexString } from './utils';
import { ReceivedDataHex } from './classes/ReceivedData';
import { AuthService } from '../auth/auth.service';

class GrantParams {
  constructor(
    public delegating_pk: string,
    public receiving_pk: string,
    public verifying_key: string,
    public capsule: string,
    public kfrag: string
  ) {}
}

class CfragParams {
  constructor(
    public delegating_pk: string,
    public receiving_pk: string,
    public verifying_key: string
  ) {}
}

class CfragResponse {
  constructor(public capsule: string, public cfrag: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class UmbralService {
  umbral!: typeof import('umbral-pre');

  // umbral ursulas
  // TODO: make this environment var
  // TODO: ensure 3 ursulas
  private ursulaDomains = environment.URSULA_DOMAINS.split(',');
  private key!: ProxyReEncryptionKey;

  constructor(private auth: AuthService, private http: HttpClient) {}

  private async initUmbralIfNotAlready() {
    if (!this.umbral) {
      this.umbral = await import('umbral-pre');

      const creds = await this.auth.getCredentials();
      const chaincode: Uint8Array = creds.chainCode;
      this.key = new ProxyReEncryptionKey(this.umbral, creds.pk, chaincode);
    }
  }

  // use for uploading file first time
  async uploadFile(file: File) {
    await this.initUmbralIfNotAlready();

    return await this.grantAccessFromFile(
      file,
      toHexString(this.key.publicKey.toBytes())
    );
  }

  // grant access
  async grantAccessFromFile(file: File, pubKey: string) {
    await this.initUmbralIfNotAlready();

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    const encryptedData = this.key.encryptBytes(
      fileBytes,
      this.umbral.PublicKey.fromBytes(fromHexString(pubKey))
    );

    await this.sendData(encryptedData);

    return encryptedData;
  }

  getDataAsFile(filename: string, encryptedData: EncryptedData) {
    const buffer = encryptedData.ciphertext.buffer;
    const encryptedFile = new File([buffer as BlobPart], filename);
    return encryptedFile;
  }

  private async sendData(data: EncryptedData) {
    const hexData = data.toHex();

    if (hexData.kfrags.length > this.ursulaDomains.length) {
      console.log(
        `Not enough ursulas for ${hexData.kfrags.length} fragments. Have ${this.ursulaDomains.length} ursulas.`
      );
      return;
    }

    await this.putKFrags(
      hexData.delegatingPubKey,
      hexData.receivingPubKey,
      hexData.verifyKey,
      hexData.capsule,
      hexData.kfrags
    );
  }

  public async decrypt(
    senderPubKey: string,
    verifyKey: string,
    data: Uint8Array
  ) {
    await this.initUmbralIfNotAlready();

    const resps = await this.getCFrags(
      senderPubKey,
      this.key.getPubKeyHex(),
      verifyKey
    );
    let capsule: string = "";
    const cfrags: string[] = [];
    resps.forEach((resp) => {
      capsule = resp.capsule;
      cfrags.push(resp.cfrag);
    });
    const recvData = new ReceivedDataHex(
      this.key.getSecKeyHex() as string,
      senderPubKey,
      verifyKey,
      data,
      capsule,
      cfrags
    );
    const actualRecvData = recvData.getActual(this.umbral);

    return this.key.decrypt(actualRecvData);
  }

  private async getCFrags(
    senderPubKey: string,
    receiverPubKey: string,
    verifyKey: string
  ) {
    const promises: Promise<CfragResponse>[] = [];

    for (let i = 0; i < this.ursulaDomains.length; ++i) {
      const ursula = this.ursulaDomains[i];

      const bodyParams = new CfragParams(
        senderPubKey,
        receiverPubKey,
        verifyKey
      );

      const res = this.http
        .post<CfragResponse>(`${ursula}/v1/cfrags`, bodyParams)
        .toPromise();
      promises.push(res);
    }

    const resps = await Promise.all(promises);

    return resps;
  }

  private async putKFrags(
    delegatingPubKey: string,
    receivingPubKey: string,
    verifyKey: string,
    capsule: string,
    kfrags: string[]
  ) {
    const promises = [];
    for (let i = 0; i < kfrags.length; ++i) {
      const kfrag = kfrags[i];
      const bodyParams = new GrantParams(
        delegatingPubKey,
        receivingPubKey,
        verifyKey,
        capsule,
        kfrag
      );

      const res = this.http
        .post<GrantParams>(`${this.ursulaDomains[i]}/v1/grant`, bodyParams)
        .toPromise();
      promises.push(res);
    }

    const resps = await Promise.all(promises);
    resps.forEach((resp) => {
      console.log('Response from ursula', resp);
    });

    return resps;
  }

  // grant access to receiverPubKey, to all documents signed with the key
  // derived from nonce
  public async grantAccess(receiverPubKey: string, nonce: number) {
    await this.initUmbralIfNotAlready();
    const fragsKeys = this.key.generateKFragsAndSignKeys(
      this.umbral.PublicKey.fromBytes(fromHexString(receiverPubKey)),
      nonce
    );
    const verifyKey = toHexString(fragsKeys.verifyKey.toBytes());

    const resps = await this.getCFrags(
      this.key.getPubKeyHex(),
      this.key.getPubKeyHex(),
      verifyKey
    );

    const capsule = resps[0].capsule;
    console.log('got capsule', capsule);

    const newKfrags: string[] = [];
    fragsKeys.kfrags.forEach((el) => {
      newKfrags.push(toHexString(el.toBytes()));
    });

    await this.putKFrags(
      this.key.getPubKeyHex(),
      receiverPubKey,
      verifyKey,
      capsule,
      newKfrags
    );
  }

  public async getPublicKeyFromAddress(
    address: string,
    maxUrsulaToCheck = 1
  ): Promise<string> {
    console.log('in here hi aaa');
    await this.initUmbralIfNotAlready();
    const promises: Promise<any>[] = [];
    for (let i = 0; i < maxUrsulaToCheck; ++i) {
      const ursula = this.ursulaDomains[i];
      const res = this.http
        .post<any>(`${ursula}/v1/getPublicKey`, { address })
        .toPromise();
      promises.push(res);
    }

    const resps = await Promise.all(promises);
    let resp = resps[0];
    for (let i = 1; i < maxUrsulaToCheck; ++i) {
      if (resp.pubkey != resps[i].pubkey) {
        throw new Error('Mismatch with data from ursulas! Responses ' + resps);
      }
    }

    return resp.pubkey;
  }

  public async requestAccess(address: string, publicKey: string) {
    const promises: Promise<any>[] = [];
    for (let i = 0; i < this.ursulaDomains.length; ++i) {
      const ursula = this.ursulaDomains[i];
      const res = this.http
        .post<any>(`${ursula}/v1/requestAccess`, { address, publicKey })
        .toPromise();
      promises.push(res);
    }

    return await Promise.all(promises);
  }

  public async getPublicKeyHex() {
    await this.initUmbralIfNotAlready();
    return this.key.getPubKeyHex();
  }
}
