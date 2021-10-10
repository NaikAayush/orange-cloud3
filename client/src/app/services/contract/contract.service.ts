import { Injectable } from '@angular/core';
import { Web3Service } from '../web3/web3.service';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  // Job IDs added by me
  public ids: string[] = [];

  constructor(private web3: Web3Service) {}

  private rnd256() {
    const bytes = new Uint8Array(32);

    // load cryptographically random bytes into array
    crypto.getRandomValues(bytes);

    // convert byte array to hexademical representation
    const bytesHex = bytes.reduce(
      (o, v) => o + ('00' + v.toString(16)).slice(-2),
      ''
    );

    // convert hexademical value to a decimal string
    return BigInt('0x' + bytesHex).toString(10);
  }

  public async addJob(
    file: File,
    name: string,
    numCpus: number,
    memBytes: number,
    type_: string = 'python'
  ) {
    const id = this.rnd256();
    this.ids.push(id);

    // TODO: add to IPFS and get CID
    const cid = 'some-cid';

    const res = await this.web3.contract.methods
      .addJob(id, cid, type_, name, numCpus, memBytes)
      .send();

    console.log('Added job to blockchain. Result:', res);

    return id;
  }

  public async getJob(id: string) {
    const res = await this.web3.contract.methods.getJob(id).call();

    console.log('Got job from blockchain', res);

    return res;
  }

  public async acceptJob(id: string) {
    const tx = this.web3.contract.methods
      .acceptJob(id, await this.web3.getAddress());

    const newTx = {
      from: this.web3.account.address,
      to: this.web3.contractAddress,
      gas: "215720",
      data: tx.encodeABI(),
    };

    const signedTx = await this.web3.account.signTransaction(newTx);

    const res = (await this.web3.getWeb3()).eth.sendSignedTransaction(signedTx.rawTransaction as string);

    console.log('Accepted job on blockchain. Result:', res);

    return res;
  }

  public async putJobOutput(id: string, cid: string) {
    const res = await this.web3.contract.methods.putJobOutput(id, cid).send();

    console.log('Put job output on blockchain. Result:', res);

    return res;
  }
}
