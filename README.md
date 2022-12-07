# Near account management and smart contracts


This repository is dedicated to:
- Account/sub-account management for Grindery on Near.
- Smart contracts on Near.


# Build a folder (a smart contract)



```bash
contract=contract_name npm run build

```
# Create a new Grindery sub-account

```bash
network=id accountname=name npm run new-account
```

With:
-  `network` denoting either  `testnet` or `mainnet`.
- `accountname` is the prefix to be given to the sub-account.

## Example of a sub-account name
### Principal account
```bash
grindery.testnet
```
### Sub-account account
```bash
example.grindery.testnet
```
### accountname
```bash
example
```