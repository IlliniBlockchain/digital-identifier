const dotenv = require("dotenv");
var axios = require('axios');
dotenv.config();

pinataJWT = process.env.PINATA_JWT;

console.log(pinataJWT);

var data = JSON.stringify({

  "pinataOptions": {
    "cidVersion": 1
  },
  "pinataMetadata": {
    "name": "testing",
    "keyvalues": {
      "customKey": "customValue",
      "customKey2": "customValue2"
    }
  },
  "pinataContent": {
    "somekey": "somevalue"
  }
});

var config = {
  method: 'post',
  url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer ' + pinataJWT
  },
  data : data
};

axios(config).then((result => {
    console.log(result.data);
}))



