import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { Account as Web3Account, HttpProvider } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  public web3!: Web3;
  public contractAddress!: string;
  public contract!: Contract;
  public account!: Web3Account;
  public initPromise: Promise<void>;

  constructor(private auth: AuthService) {
    this.initPromise = this.init();
  }

  private async init() {
    this.web3 = new Web3(environment.blockchainUrl);
    this.contractAddress = environment.contractAddress;

    const data = await this.auth.getCredentials();
    const pk = data.pk;
    console.log("Private key", pk);
    this.account = this.web3.eth.accounts.privateKeyToAccount(pk);
    await this.auth.storeAddress(this.account.address);
    // console.log(this.web3.eth.currentProvider);
    // (this.web3.eth.currentProvider as HttpProvider).addAccount(this.account.address);
    // await this.web3.eth.personal.unlockAccount(this.account.address, this.auth.password, 1000000000000000);

    console.log("web3 account", this.account, this.account.address);
    // console.log(require('src/assets/contractAbi.json'));
    console.log(await this.web3.eth.getAccounts())

    this.contract = new this.web3.eth.Contract(
      require('src/assets/contractAbi.json') as any,
      this.contractAddress,
      {
        from: this.account.address,
      }
    );
  }

  public async getWeb3() {
    await this.initPromise;

    return this.web3;
  }

  public async getAddress(): Promise<string> {
    await this.initPromise;

    const addr = this.account.address;

    if (addr === null || addr === undefined || !addr) {
      console.log('Could not get address. Got: ', addr);
    }

    return addr;
  }
}
