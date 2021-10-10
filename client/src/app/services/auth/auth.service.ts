import { Injectable } from '@angular/core';
import * as bip32 from 'bip32';
import * as Bip39 from 'bip39';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private dbService: NgxIndexedDBService) {}

  private generateMnemonic() {
    return Bip39.generateMnemonic();
  }

  private generateSeed(mnemonic: string, password: string) {
    return Bip39.mnemonicToSeedSync(mnemonic, password);
  }

  private generateBIP32(seed: Buffer) {
    return bip32.fromSeed(seed);
  }

  public createAccount(password: string) {
    const mnem = this.generateMnemonic();
    const seed = this.generateSeed(mnem, password);
    const root = this.generateBIP32(seed);
    console.log(root);
    console.log(
      { mnemonic: mnem, pk: root.privateKey?.toString('hex') },
      root.chainCode
    );
    this.login(root.privateKey?.toString('hex') as string, root.chainCode);
    return { mnemonic: mnem };
  }

  public retrieveAccount(mnem: any, password: any) {
    const seed = this.generateSeed(mnem, password);
    const root = this.generateBIP32(seed);
    // console.log({ pk: root.privateKey?.toString('hex') });
    this.login(root.privateKey?.toString('hex') as string, root.chainCode);
    // return { pk: root.privateKey?.toString('hex') };
  }

  private hashPrivateKey(pk: string) {
    return btoa(pk);
  }

  private login(pk: string, chainCode: Buffer) {
    const hash = this.hashPrivateKey(pk);
    this.dbService.update('auth', {
      id: 1,
      privateKey: hash,
      chainCode: chainCode,
    });
  }

  public logout() {
    console.log('logout');
    this.dbService.clear('auth');
  }

  public async getCredentials() {
    const data: any = await this.dbService.getByKey('auth', 1).toPromise();
    const pk = atob(data.privateKey);
    const chainCode = data.chainCode;
    const address = data.address;
    // console.log(pk, chainCode, address);
    return { pk: pk, chainCode: chainCode, address: address };
  }

  public async storeAddress(address: any) {
    const data = await this.getCredentials();
    const hash = this.hashPrivateKey(data.pk);
    this.dbService.update('auth', {
      id: 1,
      privateKey: hash,
      chainCode: data.chainCode,
      address: address,
    });
  }

  async getLoginStatus() {
    try {
      await this.getCredentials();
      return true;
    } catch (error) {
      return false;
    }
  }
}
