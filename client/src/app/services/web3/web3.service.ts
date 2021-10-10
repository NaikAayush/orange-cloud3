import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  public web3: Web3;
  private contractAddress: string;
  public contract: Contract;

  constructor() {
    this.web3 = new Web3(environment.blockchainUrl);
    this.contractAddress = environment.contractAddress;
    this.contract = new this.web3.eth.Contract(require("src/assets/contractAbi.json") as any, this.contractAddress);
  }

  public getAddress(): string {
    const addr = (this.web3.currentProvider as any).selectedAddress;

    if (addr === null || addr === undefined || !addr) {
      console.log("Could not get address. Got: ", addr);
    }

    return addr;
  }
}
