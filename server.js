const express = require('express');
const app = express();
const bitcore = require('bitcore-lib');
const Insight = require('bitcore-insight').Insight;
const cors = require('cors');
const bodyParser = require('body-parser');

// user places private key
// user sees their balance
// user can send bitcoin to another address
// user sees their transaction history

// PrivKey: fe4b353424570a00c99cafb12be3648272350216be6de94eac1c35b63ed240b3

// let privateKeyWIF = 'cW71rTqCqWoUcFcCuETwniDsiqf1Ecx1x3Qc6QnGPV5Z5mPcPka3';

let insight = new Insight('testnet');

app.use(cors());
app.use(bodyParser.json())
 
app.get('/', function(req, res) {
    const privateKey = new bitcore.PrivateKey();
    const wif = privateKey.toWIF();
    const address = privateKey.toAddress();
    res.json({
        wif: wif,
        address: address,
        amount: 0
    });
});

app.get('/key/:wif', (req, res) => {
    let wif = req.params.wif;
    let privado = bitcore.PrivateKey.fromWIF(wif);
    console.log(privado);
    let BitAddress = privado.toAddress();
    insight.getUtxos(BitAddress, (err, utxos) => {
        if(err){
          //Handle errors
          return err;
        }else {
          // use the UTXOs to create transaction
          res.json(utxos);
        }
    });
});
// gets transaction history
app.get('/address/:addr', (req, res) => {
    let addr = req.params.addr;
    insight.address(addr, (err, address) => {
        if(err){
          //Handle errors
          return err;
        }else {
          res.json({
              address,
          })
        }
    });
});
app.get('/tx/:id', (req, res) => {
    const txid = req.params.id;
    insight.getTransaction(txid, (err, txInfo) => {
        if (err) {
            return err;
        } else {
            res.json(txInfo);
        }
    });
});
app.post('/send', (req, res) => {
    const wif = req.body.wif;
    const addressTo = req.body.addressTo;
    const amount = Number(req.body.amount) * 100000000;
    const fee = Number(req.body.fee) * 100000000; 
    let privateKey = bitcore.PrivateKey.fromWIF(wif);
    let addressFrom = privateKey.toAddress(); 
    insight.getUtxos(addressFrom, (err, utxos) => {
        if(err){ 
          //Handle errors
          return err;
        }else { 
            // use the UTXOs to create transaction
            let tx = bitcore.Transaction();
            tx.from(utxos);
            tx.to(addressTo, amount);
            tx.change(addressFrom);
            tx.fee(fee);
            tx.sign(privateKey);
            tx.serialize();

            insight.broadcast(tx.toString(), (error, txid) => {
                if (error) {
                    return error;
                } else {
                    res.json(txid);
                }
            })
        }
    });
});

app.listen(8080, function(req, res) {
    console.log('On port 8080');
}); 