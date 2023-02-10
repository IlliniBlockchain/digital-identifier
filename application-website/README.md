# Application Website

## Functionality

The application website is a simple React App to simulate a customer applying for a credit card/creating an account of some sort.  This is where the NFTs or “Synchrony Digital Identifiers” are minted to the customer’s wallet.

The process looks like this:

1. Customer connects their metamask wallet
2. Customer fills out their information and submits
3. The customer is prompted for their wallet public key to encrypt their sensitive information.  Once this happens only the customer can decrypt their information.  Not even Synchrony can.
4. A transaction is sent to the Ethereum network (in this prototype it is the Goerli testnet) for an NFT to be minted to the customer.  This transaction is not sent by the customer, but rather by the Synchrony wallet that is “hard coded” into the website (more on this later).
5. If the NFT is successfully created the customer’s encrypted data sent and stored in a database, currently using getSandbox.  Customer data is not actually stored within the NFT, but rather in an outside resource and a URI is stored within the NFTs that points to this outside resource.
6. If the NFT is created and the customer data is successfully stored in the database, then we are done!
7. Should the NFT fail to be created it is most likely because the customer already has one in their wallet, although there are other possible reasons.

## Folder Breakdown

This is a basic React App.  The only thing to be aware of is that you will have to **create your own .env file**.  

The .env file should be stored in the application-website folder, but not a part of any of its subfolders.  It should take the following format:

```jsx
REACT_APP_DEPLOYER_PRIVATE=
```

You should place the **private key of the wallet you used to deploy your smart contract** here.  This is because the deployer of the smart contract is the only one allowed to call mint, transfer, burn, therefore in order to this site to mint NFTs, the same wallet must be used.

Once again, make sure this **.env file is never committed.**

## Instructions

1. npm i to install dependencies
2. Make sure you have already deployed your smart contract
3. Change the contractAddress to the address of the contract you have deployed
4. Create an alchemy account and place replace my api key for the provider variable
5. Create the .env folder as desribed above.  Make sure that the wallet has Goerli testnet eth.
6. npm start to start a testing locally