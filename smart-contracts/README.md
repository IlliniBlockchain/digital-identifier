# ERC721Identifier Contract

## Functionality

The ERC721Identifier smart contract is an ERC721 contract with a few key extensions that make it more suitable for a bank/bank consortium looking to create an identity management system.  

The extensions include:

1. ERC721Metadata: Functionality for URIs that point to outside resources holding metadata
2. ERC721Enumerable:  IDs can be sensibly counted, indexed, and managed
3. AccessControl: Allows for role assignment and permissioned functions

Using ERC721 and these extensions ERC721Identifier contains the following functionality

1. The deployer of the contract is assigned the “Minter Role”.  This Role is the only party allowed to call transfer, mint, and burn.  
2. Only one token per wallet.
3. Storage of token metadata pointed to by URI stored in each NFT to reduce on-chain storage costs

## Folder Breakdown

There are two folders you should be concerned with in this project:

1. **Contracts**

Holds the actual smart contract code.  It is ERC721Identifier.sol.  If you would like to change the underlying functionality of the contract this is where you should go.  

Use the OpenZepplin docs and standards to implement or edit functionality. 

1. **Scripts**

Holds the scripts needed to deploy/test locally and to deploy to the mainnet/testnets.  The run.js script spins up a local Ethereum network on your computer and deploys the contract to it.  You can then call functions to test your contract.  

The deploy.js will deploy the the contract to the Goerli testnet.  Can be easily changed to deploy to the mainnet.  

Because it matters who deploys the contract (assigned the minter role), we need to create a specific wallet that does this that we have control over.  This script relies on a .env file that should take the following format:

```jsx
**DEPLOYER_PRIVATE=

ALCHAPIKEY=

ETHERAPIKEY=

INFURAAPIKEY =** 
```

For this script to work you will to create accounts and get API keys for each of these services as well as create an Ethereum wallet and inputs its private key.  **Make sure to never commit this file.**

Additionally, since we are deploying to a testnet from a wallet that we own, we need Goerli testnet Eth to fund our transactions.  Do this by funding your wallet with a Goerli testnet faucet.

**In order to run scripts you must use the npx hardhat run command.  So for deploy.js it would be: npx hardhat run scripts/deploy.js**

## Instructions

1. npm i to install dependencies
2. Edit contract to your liking
3. Use run.js script to test contract locally.  To run scripts type: npx hardhat run scripts/filename.  So for run.js it would be npx hardhat run scripts/run.js.
4. Deploy to testnet using deploy.js.  **Make sure that your .env folder is set up and that the deploying wallet is funded with Goerli testnet eth**
5. Keep in mind that everytime you deploy a new contract, it has a new address meaning that if you are linking a front end to your contract, you will have to change it there