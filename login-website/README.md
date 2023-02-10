# Login Website
## Functionality

This login website is a simple React App to simulate a customer logging in to an account of some sort.  For example to pay a credit card bill or view their bank account.  This is where we check if the customer possesses a Synchrony Digital ID and the metadata associated with their digital ID should they have one.  I also included functionality for the customer to decrypt their metadata, which is more for the customer experience and is actually not needed in the login process.

The process looks like this:

1. The customer connects their metamask wallet
2. A call is made to the smart contract you deployed requesting the balance of the connected wallet address (balance here refers to the balance of NFTs created by this contract).  
3. If the wallet holds 1 Synchrony Digital ID, the token URI within the NFT is used in a GET request to retrieve the metadata associated with the customer’s NFT (currently storing in GetSandbox).  
4. Button turns green, customer metadata is displayed (still encrypted)
5. At this point the user is logged into the website.  I offer the option for the user to decrypt the metadata merely to show that the functionality is possible and inspire further use cases.
6. If the customer hits the decrypt button, Metamask prompts the customer to use their private key to decrypt the metadata.
7. Going back to step 3, if the customer does not have a Synchrony Digital ID in their wallet, the button turns red, and the customer is informed that they do not yet have an account.  It is impossible for the customer to have anything other than 0 or 1 NFTs as specified in the ERC721Identifier contract.  

## Folder Breakdown

This is a basic React App.  All functionality is contained in App.js.  Nothing crazy, even Metamask functionality does not get more complicated the React hooks.  

## Instructions

1. npm i to install dependencies
2. npm start to begin local development