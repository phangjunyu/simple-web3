const express = require('express');
const path = require('path');
const request = require('request');
const app = express();
var Web3 = require('web3');
var web3 = new Web3("http://localhost:8545");
var fs = require('fs');
var bodyParser = require('body-parser');
var async = require('async');

const destAddress = "0x47a793D7D0AA5727095c3Fe132a6c1A46804c8D2";

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.get('/', function (req, res) {
    res.render('index', { name: 'Virtual Offchain Orderbook Relayer'})
})

app.use(bodyParser.json());      // to support JSON-encoded bodies

app.get('/query', function(req, res){
    var srcToken = req.param('srcToken');
    var srcQty = req.param('srcQty');
    var destToken = req.param('destToken');
    console.log(srcToken, srcQty, destToken);
    srcToken = tokenAddress(srcToken);
    destToken = tokenAddress(destToken);
    
    console.log(srcToken, destToken);
    instantiateKyber(srcToken, srcQty, destToken)

    // let zxResult = instantiateZX(srcToken, srcQty, destToken)
    // if (zxResult){
    // }    
}) 

app.get('/trade', function(req, res){
    var srcToken = req.param('srcToken');
    var srcQty = req.param('srcQty');
    var destToken = req.param('destToken');
    console.log(srcToken, srcQty, destToken);
    srcToken = tokenAddress(srcToken);
    destToken = tokenAddress(destToken);
    
    console.log(srcToken, destToken);
    execKyber(srcToken, srcQty, destToken)

    // let zxResult = instantiateZX(srcToken, srcQty, destToken)
    // if (zxResult){
    // }    
}) 
  
app.get('/execZX', function(req, res) {
    //be a taker! or push to order book
})

function execKyber(srcToken, srcQty, destToken){
    fs.readFile('Relayer.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var jsonInterface = JSON.parse(data);
        var relayer = new web3.eth.Contract(jsonInterface, '0xF23276778860e420aCFc18ebeEBF7E829b06965c', {
            from: '0x1234567890123456789012345678901234567891', // default from address
            gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });
        console.log(relayer.options);
        relayer.methods.execSwap(srcToken, srcQty, destToken, destAddress, 100);
    });
}

function instantiateZX(srcToken, srcQty, destToken){

}

function instantiateKyber(srcToken, srcQty, destToken){
    fs.readFile('Relayer.json', 'utf8', function (err, data) {
        if (err) throw err; // we'll not consider error handling for now
        var jsonInterface = JSON.parse(data);
        var relayer = new web3.eth.Contract(jsonInterface, '0x8A063452f7dF2614Db1bCa3A85eF35DA40cF0835', {
            from: '0x1234567890123456789012345678901234567891', // default from address
            gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });
        console.log(relayer.options);
        relayer.methods.queryKyber(srcToken,srcQty,destToken).call().then(function resolved(result){
            console.log(result);
            return result;
        }, function rejected(response){
            console.log(response);
            return response;
        })
    });
    return;
}

app.use((err, request, response, next) => {
// log the error, for now just console.log
if (err){
    console.log(err)
    response.status(500).send('Something broke!')
}
    
})


app.listen(3001)
console.log("app listening on 3001")

function tokenAddress(token){
    switch(token){
        case 'KNC':
            token = '0x6000EcA38b8B5Bba64986182Fe2a69c57f6b5414';
            break;
        case 'OMG':
            token = '0x7e3f4E1deB8D3A05d9d2DA87d9521268D0Ec3239';
            break;
        case 'ZIL':
            token = '0x8726C7414ac023D23348326B47AF3205185Fd035';
            break;
        case 'SALT':
            token = '0x04B5dAdd2c0D6a261bfafBc964E0cAc48585dEF3';
            break;
        case 'MANA':
            token = '0x4112f5fc3f737e813ca8cC1A48D1da3dc8719435';
            break;
        default:
            token = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    }
    return token;
}
