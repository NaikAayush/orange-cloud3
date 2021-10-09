# Orange Smart Contracts

## Requirements

 - Truffle (`v5.4.2`)
    - `sudo npm install -g truffle`
 - Ganache (local blockchain)
    - `sudo npm install -g ganache-cli`

## Development

### Start ganache

Local blockchain with 10 accounts.

```
ganache-cli -a 10 -p 8550
```

### Deploy contracts

Deploy contracts to it:
```
truffle migrate
```

### Test in console

Start console:
```
truffle console
```

Initialize helpers:
```js
const orange = await Orange.deployed();
const accounts = await web3.eth.getAccounts();
```

### Run tests

```
truffle test
```