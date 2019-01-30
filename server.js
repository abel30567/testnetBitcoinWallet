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

// Testnet 
let insight = new Insight('testnet');

app.use(cors());
app.use(bodyParser.json())
 
app.get('/', function(req, res) {
    const privateKey = new bitcore.PrivateKey('testnet');
    const wif = privateKey.toWIF();
    const address = privateKey.toAddress();
    let addy = address.toString();
    res.json({
        wif: wif,
        address: addy,
        amount: 0
    });
});

/**
 * Will return a UTXO object 
 * https://github.com/abel30567/bitcore-insight#retrieving-unspent-utxos-for-an-address-or-set-of
 *
 * @param {string} WIF - The wallet import format of a Bitcoin private key 
 * @returns {object} The corresponding UTXO object based on the private key provided
 */
app.get('/key/:wif', (req, res) => {
    let wif = req.params.wif;
    let privado = bitcore.PrivateKey.fromWIF(wif);
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
/**
 * Will return an address object giving information about the Bitcoin address 
 * https://github.com/abel30567/bitcore-insight#retrieving-transactions-and-balance-of-an-address
 * 
 * @param {string} address - A Bitcoin address as a string
 * @returns {object} The address object with most updated information from Bitcoin network 
 */
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

/**
 * Will return a txid object giving the inputs and outputs of a Bitcoin transaction 
 * https://github.com/abel30567/bitcore-insight#retrieving-transaction-by-transaction-id
 *  
 * @param {string} txid - A Bitcoin transaction hash
 * @returns {object} The transaction object with input information (from what address and how much was input) 
 * to the outputs (what addresses received portions of the inputs) as well as Bitcoin network fee
 */
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

/**
 * Will return a txid string of a successful transaction
 * https://github.com/abel30567/bitcore-insight#retrieving-transaction-by-transaction-id
 *  
 * @param {string} wif - The sender's Bitcoin Wallet Import Format
 * @param {string} addressTo - The receiving Bitcoin address
 * @param {number} amount - How much Bitcoin to send
 * @param {number} fee - Bitcoin network fee
 * @returns {string} The transaction id string of a broadcasted Bitcoin transaction
 */
app.post('/send', (req, res) => {
    const wif = req.body.wif;
    const addressTo = req.body.addressTo;
    const amount = Number(req.body.amount) * 100000000;
    const fee = Number(req.body.fee) * 100000000; 
    let privateKey = bitcore.PrivateKey.fromWIF(wif);
    let addressFrom = privateKey.toAddress(); 
    // Receive latest UTXO from a Bitcoin address
    insight.getUtxos(addressFrom, (err, utxos) => {
        if(err){ 
          //Handle errors
          return err;
        }else { 
            // use the UTXOs to create transaction object
            let tx = bitcore.Transaction();
            tx.from(utxos);
            tx.to(addressTo, amount);
            tx.change(addressFrom);
            tx.fee(fee);
            tx.sign(privateKey);
            tx.serialize();

            // Broadcast the transaction to the Bitcoin network
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