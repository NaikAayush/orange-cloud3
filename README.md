<p align="center" width="100%">
<img src=https://easydrawingguides.com/wp-content/uploads/2020/03/Orange-Step-10.png width=50%>
</p>

# Orange Cloud

Orange Cloud, is an easy to use, decentralized cloud/compute system. You submit a script to be run and it's run by one of the nodes in our network. Or you can provide your idle compute power to be used by people willing to pay for it.

This repository contains the source code for all of the project.

## Usage

### Requirements

 - Operating system: tested on Linux (Fedora, Debian) and Windows 10/11. Should work on Mac OS too.
 - Docker: necessary to run jobs sandboxed. Refer to [this page](https://docs.docker.com/engine/install/) for installation instructions.
 - IPFS: a local IPFS daemon is necessary to upload scripts and outputs. Refer to [this page](https://docs.ipfs.io/install/ipfs-desktop/) for installation instructions.
 - node (v14) and npm (v6): temporarily necessary to run the frontend. Can be removed in the future.
 - Golang (1.16): necessary to run the go daemon. Can be removed in the future by distributing the binary.

### Start

Start the frontend:
```
npm install -g @angular/cli
cd client
npm i
ng serve
```

Start the go daemon (in another terminal):
```
cd orange-daemon
go run .
```

Start IPFS daemon (opening the desktop app should suffice) and docker.

Navigate to http://localhost:4200/ in the browser to access Orange Cloud.

## Code Structure

 - [client](./client/): The frontend, implemented in Angular. Contains all of the blockchain/web3 communication and daemon communication.
 - [orange-daemon](./orange-daemon/): The daemon, implemented in Golang. This is an HTTP API that runs jobs in docker and communicates with IPFS.
 - [subgraph](./orangesubgraph/): The Graph hosted service' subgraph specification - YAML, GraphQL schema, mapping script.
 - [smart-contracts](./smart-contracts/): Solidity smart contracts that run on the chain.

## License

MIT
