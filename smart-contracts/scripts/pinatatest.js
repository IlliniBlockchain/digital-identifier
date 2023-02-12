// Use the api keys by providing the strings directly 
const pinataSDK = require('@pinata/sdk');
const dotenv = require("dotenv");
dotenv.config();

const pinata_secret_api_key = process.env.PINATA_SECRET_API;

const pinata = new pinataSDK('b9316525f781c40bdfa2', pinata_secret_api_key);


pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
    return;
}).catch((err) => {
    //handle error here
    console.log(err);
});

const body = {
    message: 'AKSDFA'
};

const options = {
    pinataMetadata: {
        name: "HI",
        keyvalues: {
            FirstName: 'asdf',
            LastName: 'l'
        }
    },
    pinataOptions: {
        cidVersion: 1
    }
};




pinata.pinJSONToIPFS(body, options).then((result) => {
    //handle results here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

const metadataFilter = {
    name: "HI",
};

const filters = {
    status : 'pinned',
    pageLimit: 10,
    pageOffset: 0,
    hashContains: "bafkreibmzfw24k6ruyk4japdekq3o4s4zmsnaynntnpufzrcx6lzjh5ugi"
    // metadata: metadataFilter
};


pinata.pinList(filters).then((result) => {
    console.log(result);
    result.rows.forEach(element => {
        console.log(element.metadata);
    });
}).catch((err) => {
    console.log(err);
});

