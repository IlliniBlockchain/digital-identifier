const { ethers } = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}


const main = async () => {

    // get private key from .env
    let deployerprivate = process.env.DEPLOYER_PRIVATE;
    const ALCHAPIKEY = process.env.ALCHAPIKEY;
    const ETHERAPIKEY = process.env.ETHERAPIKEY;
    const INFURAAPIKEY = process.env.INFURAAPIKEY;

    // get a web3 provider
    const provider = await ethers.getDefaultProvider("goerli", { alchemy: ALCHAPIKEY, etherscan: ETHERAPIKEY, infura: INFURAAPIKEY});
    
    // const network = "https://api.avax-test.network/ext/bc/C/rpc"
    // const provider = ethers.getDefaultProvider(network)

    // Turning string into datahexstring
    console.log(deployerprivate);
    deployerprivate = hexToBytes(deployerprivate);

    // Making sure that this is private key is a datahexstring
    console.log(ethers.utils.isBytesLike(deployerprivate));

    // Creating wallet instance
    const Synchrony = new ethers.Wallet(deployerprivate, provider);

    const SynchronyBalance = await Synchrony.getBalance();
  
    await console.log("Deploying contracts with account: ", Synchrony.getAddress());
    await console.log("Account balance: ", SynchronyBalance.toString());
  
    const Token = await hre.ethers.getContractFactory("ERC721Identifier")
    const synchronyToken = await Token.connect(Synchrony);
    const portal = await synchronyToken.deploy('ONEID Digital Identifier Collection', 'Digital Identifier Collection for UPenn Hackathon', "");
    await portal.deployed();
  
    console.log("Contract address: ", portal.address);

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();