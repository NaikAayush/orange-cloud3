<p align="center" width="100%">
<img src=https://easydrawingguides.com/wp-content/uploads/2020/03/Orange-Step-10.png width=50%>
</p>

# Orange Cloud

Orange Cloud, is an easy to use, decentralized cloud/compute system. You submit a script to be run and it's run by one of the nodes in our network. Or you can provide your idle compute power to be used by people willing to pay for it.

This repository contains the source code for all of the project.

## Usage

TODO

## Code Structure

 - [client](./client/): The frontend, implemented in Angular. Contains all of the blockchain/web3 communication and daemon communication.
 - [orange-daemon](./orange-daemon/): The daemon, implemented in Golang. This is an HTTP API that runs jobs in docker and communicates with IPFS.
 - [subgraph](./orangesubgraph/): The Graph hosted service' subgraph specification - YAML, GraphQL schema, mapping script.
 - [smart-contracts](./smart-contracts/): Solidity smart contracts that run on the chain.

## License

MIT
