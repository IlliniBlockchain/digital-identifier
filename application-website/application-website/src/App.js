import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import mainLogo from'./SYF.png';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { useEffect, useState } from "react";
import abi from "./utils/ERC721Identifier.json";
import { ethers } from "ethers";
import { encrypt } from '@metamask/eth-sig-util'
import './App.css';
const ethUtil = require('ethereumjs-util')


let deployerSK = process.env.REACT_APP_DEPLOYER_PRIVATE;

deployerSK = hexToBytes(deployerSK);

const contractAddress= '0x71216e9d9604186130638e6a81ec339dc7272Ad7';
const contractABI = abi.abi;
const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/E5Ogmdfcb9fdjqsW3zNW3ab93X8m1Ihy');

const Synchrony = new ethers.Wallet(deployerSK, provider);

//creating a new contract "instance" with Synchrony as the signer

const identifierContract = new ethers.Contract(contractAddress, contractABI, Synchrony);

/**
 * 
 * @param {string} hex The hexstring to turn into bytes 
 * @returns bytes
 */
function hexToBytes(hex) {
  if (!hex) {
    return []
  } else {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }
}

/**
 * Encrpyts a given piece of data
 * @param {base64} publicKey Public encryption key in the buffered in base64 format
 * @param {string} data Data to be encrypted
 * @returns Encrpyted data object in buffered to hex
 */
function encryptData(publicKey, data) {
  const enc = ethUtil.bufferToHex(
    Buffer.from(
      JSON.stringify(
        encrypt({
          publicKey: publicKey.toString('base64'),
          data: data,
          version: 'x25519-xsalsa20-poly1305',
        })
      ),
      'utf8'
    )
  );

  return enc;
}


/**
 * 
 * @param {base64} publicEncryptionKey Public encryption key in the buffered in base64 format
 * @param {string} walletaddress Rest of parameters also follow this format.  This the the identifier data to be placed into a json object and encrypted
 * @returns encrypted jsonid
 */
function createEncryptedJsonObject(publicEncryptionKey, walletaddress, firstname, middlename, lastname, address, unit, city, state, zip, email, phone, ssn, birthdate) {
  const idinfo = {
    walletAddress: walletaddress, 
    firstName: encryptData(publicEncryptionKey, firstname),
    middlename: encryptData(publicEncryptionKey, middlename),
    lastName: encryptData(publicEncryptionKey, lastname),
    address: encryptData(publicEncryptionKey, address),
    unit: encryptData(publicEncryptionKey, unit),
    city: encryptData(publicEncryptionKey, city),
    state: encryptData(publicEncryptionKey, state),
    zip: encryptData(publicEncryptionKey, zip),
    email: encryptData(publicEncryptionKey, email),
    phone: encryptData(publicEncryptionKey, phone),
    ssn: encryptData(publicEncryptionKey, ssn), 
    _birthdate: encryptData(publicEncryptionKey, birthdate)
  } 
  const jsonidinfo = JSON.stringify(idinfo);
  return jsonidinfo;
}



function PersonalDataForm() {
  const [validated, setValidated] = useState(false);
  const [checkBoxState, setCheckBoxState] = useState(false);
  const [displayform, setDisplayForm] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ssn, setSSN] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [afterSubmitText, setAfterSubmitText] = useState('');

  /**
 * 
 * @param {string} walletAddress The wallet address of the account to mint an NFT to
 * @returns hash of transcation if successful
 */

const createNFT = async(walletAddress) => {
  try {
    console.log("going to mint to wallet walletAddress", walletAddress);
    const mintTxn = await identifierContract.mint(walletAddress);
    await console.log("Creating the NFT with hash: ", mintTxn.hash);
    await mintTxn.wait();
    console.log("Done! Another?")
    } catch (e) {
      console.error(e)
      throw e;
    }
}

  // Metamask functionality, mostly boilerplate
  const isMetaMaskInstalled = async () => {
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }
  
  const checkIfWalletIsConnected = async () => {
    if (isMetaMaskInstalled() === false) {
      console.log("Get Metamask!");
      alert("Get Metamask!");
      return false;
      // only logging to console for now, can add functionality to display a link . . .
    }
    
    try {
  
      const { ethereum } = window;
      
      // request access to eth accounts in metamask
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setButtonText("Connected with: " + currentAccount);
        return true;
      } else {
        console.log("No authorized account found");
        return false;
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  
    const handleSubmit = async(event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setDisplayForm(false);
      setAfterSubmitText("Loading . . . ")
      
      // Commented code is in the first step in migrating to ipfs instead of an API endpoint
      // const ipfs = IPFS.create();
      // const {cid} = ipfs.add('Hello World');
      // console.info(cid);

      // first we must create a json object from the data in our form, must be encrypted as well
      console.log("Going to create JSON object entry with " + currentAccount);

      // This is where data will be encrypted
      const { ethereum } = window;

      const keyB64 = await ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [currentAccount],
      });

      const publicEncryptionKey = Buffer.from(keyB64, 'base64');

      console.log(publicEncryptionKey);

      setAfterSubmitText(" Encrypting . . .")
      const encryptedJsonId = await createEncryptedJsonObject(publicEncryptionKey, currentAccount, firstName, middleName, lastName, address, unit, city, state, zip, email, phone, ssn, birthdate);

      
      // format the POST request
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://identifier-database.getsandbox.com:443/identifiers");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (this.status === 200) {
          console.log("Successfully created NFT and the record for it.");
          setAfterSubmitText("Successfully minted NFT to wallet address: " + currentAccount + ".  Please proceed to the login website!");
          setValidated(true);
        } else {
          console.log(xhr.responseText);
        }
      }
      try {
        setAfterSubmitText("Creating NFT . . . Blockchain is a distributed system so this may take a few seconds");
        await createNFT(currentAccount);
        // if no error is thrown by createNFT, then we send the json to the server.
        xhr.send(encryptedJsonId);
      } catch (e) {
        console.log("An error occurred creating your NFT.  Make sure that this wallet does not already contain a digital Id.")
        setAfterSubmitText("An error occurred creating your NFT.  Make sure that this wallet does not already contain a digital Id.");
      }
    }  
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]) // eslint-disable-line react-hooks/exhaustive-deps
  
  return(
    <div className='wrapper'>
    <Row>
    {displayform && (
      <>
    <button className="connectWallet" id="connectWallet" onClick= {connectWallet}>{buttonText}</button>
    <Form noValidate validated = {validated} onSubmit = {handleSubmit} >
      <Row className="mb-3">
        <Form.Group as={Col} controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control required type="firstName" placeholder="Micheal" onChange={event => setFirstName(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter first name
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="middleName">
          <Form.Label>Middle Name (Optional)</Form.Label>
          <Form.Control type="middleName" placeholder="Gary" onChange={event => setMiddleName(event.target.value)} />
        </Form.Group>
          <Form.Group as={Col} controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type="lastName" placeholder="Scott" onChange={event => setLastName(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter last name
            </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group  as = {Col} className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control required placeholder="1234 Main St" onChange={event => setAddress(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter an address
            </Form.Control.Feedback>
        </Form.Group>

        <Col xs = "auto">
          <Form.Group className="mb-3" controlId="formGridAddress2">
            <Form.Label>Unit # (Optional)</Form.Label>
            <Form.Control placeholder="#328" onChange={event => setUnit(event.target.value)} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control required placeholder= "Scranton" onChange={event => setCity(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter a city
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>State</Form.Label>
          <Form.Select required defaultValue="" onChange={event => setState(event.target.value)} >
            <option value="??">Select State</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">Dist of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>Zip</Form.Label>
          <Form.Control required placeholder= "18503" onChange={event => setZip(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter zipcode
            </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control required placeholder = "MichealScott@gmail.com" onChange={event => setEmail(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter email
            </Form.Control.Feedback>
          <br></br>
        </Form.Group>

        <Col xs = "auto">
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control required placeholder= "9999999999" onChange={event => setPhone(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter phone number
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="formSocialSecurity">
            <Form.Label>Social Security Number</Form.Label>
            <Form.Control required placeholder= "123-45-6789" onChange={event => setSSN(event.target.value)} />
            <Form.Control.Feedback type="invalid">
              Please enter social security
            </Form.Control.Feedback>
          <br></br>
          </Form.Group>

        <Col xs = "auto">
        <Form.Group controlId="formBirthDate">
            <Form.Label>Birthdate</Form.Label>
            <Form.Control required placeholder= "MM/DD/YYYY" onChange={event => setBirthdate(event.target.value)} />
          <Form.Control.Feedback type="invalid">
              Please enter birthdate
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check onChange={event => setCheckBoxState(!checkBoxState)}type="checkbox" label="Check this box if you want a digital Synchrony ID allowing passwordless authentication"/>
      </Form.Group>
          {checkBoxState === true && (          
            <>
            <p>Will mint to address: {currentAccount} </p>
            </>
          )
        }

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
      </>
      )
    }
    { !displayform && (
      <>
      <p>{ afterSubmitText }</p>
      
  
      </>
    )}
    </Row>
    </div>
      )
}

function App() {
  return (
    <div className="App">
  <Navbar variant='dark' bg='dark' sticky = 'top'>
    <div className= 'navbarContainer'>
      <div className = "imgContainer">
        <Navbar.Brand href="#home">
          <img src= {mainLogo} width='35' height='35' alt = 'synchrony               logo'className="d-inline-block align-top"
          />{' '}
          Synchrony (FOR TESTING PURPOSES, DONT ENTER YOUR REAL INFO)
        </Navbar.Brand>
      </div>  
    </div>
  </Navbar>
  <div className= "directionsContainer">
    Fill out the form to apply for an account/card!
  </div>
  <div className="formContainer">  
      {PersonalDataForm()}
  </div>
</div>
  );
}

export default App;
