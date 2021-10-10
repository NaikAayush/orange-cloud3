import { Injectable } from '@angular/core';

import '@superfluid-finance/js-sdk';
import { Framework, User } from '@superfluid-finance/js-sdk';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root'
})
export class SuperfluidService {
  public sf!: Framework;
  private user!: User;
  constructor(private web3: Web3Service) {}

  async init(walletAddress: string) {
    this.sf = new Framework({web3: this.web3.web3});
    await this.sf.initialize();
    this.user = this.sf.user({
      address: walletAddress,
      token: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f', // fDAIx Mumbai Testnet
    });
  }

  async startFlow(receiverWalletAddress: string) {
    await this.user.flow({
      recipient: receiverWalletAddress,
      flowRate: '385802469135802',
    });
  }

  async stopFlow(receiverWalletAddress: string) {
    await this.user.flow({
      recipient: receiverWalletAddress,
      flowRate: '0',
    });
  }

}
