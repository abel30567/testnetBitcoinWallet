import React, { Component } from 'react';
import axios from 'axios';
import Radium from 'radium'; // lets us use :focus :active as inline
import QRCode from 'qrcode.react';
import Transaction from './components/Transaction';

import './_app.css'
import styles from './App.css.js';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: 'enter WIF',
      balance: 0,
      network: 'None',
      transactions: [],
      qr: '',
      showInput: 'block',
      showResult: 'none',
      fastStyle: styles.selectBtn,
      economicStyle: styles.nonSelectBtn,
      feeCost: 0.0005,
    };
    this.getAddressT = this.getAddressT.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFee = this.handleFee.bind(this);
    this.handleAddressTo = this.handleAddressTo.bind(this);
    this.sendTx = this.sendTx.bind(this);
    this.getAddress = this.getBalance.bind(this);
    this.newAddress = this.newAddress.bind(this);
  }
  componentDidMount() { 
   // cW71rTqCqWoUcFcCuETwniDsiqf1Ecx1x3Qc6QnGPV5Z5mPcPka3
  //  console.log('hi')
  }
  getAddressT(e) {
    let wif = e.target.value;
    // console.log(e.target.value)
    axios.get(`http://localhost:8080/key/${wif}`, { crossdomain: true })
    .then((res) => {
      // console.log(res);
      this.setState({
        _wif: wif,
        address: res.data[0].address,
        balance: res.data[0].amount,
        qr: <QRCode value={res.data[0].address} />
      }, () => {
        this.getTransactions(this.state.address);
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }
  newAddress() {
    axios.get('http://localhost:8080/', { crossdomain: true })
    .then((res) => {
      console.log(res);
      this.setState({
        _wif: res.data.wif,
        address: res.data.address.hash,
        balance: res.data.amount,
        qr: <QRCode value={res.data.address.hash} />,
        showInput: 'none',
        showResult: 'block'
      }, () => {
        // console.log(this.state);
        // this.getTransactions(this.state.address);
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  getBalance() {
    axios.get(`http://localhost:8080/key/${this.state._wif}`, { crossdomain: true })
    .then((res) => {
      // console.log(res);
      this.setState({
        balance: res.data[0].amount,
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }
  getTransactions(address) {
    axios.get(`http://localhost:8080/address/${address}`, { crossdomain: true })
    .then((res) => {
      // console.log(res);
      this.setState({
        network: res.data.address.address.network,
        transactions: res.data.address.transactionIds,
        showInput: 'none',
        showResult: 'block'
      }, () => {
        // console.log(this.state.transactions, 'transact')
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }
  handleAmountChange(e) {
    const re = /^(?!\.?$)\d{0,6}(\.\d{0,6})?$/;
    if (e.target.value == '' || re.test(e.target.value)) {
      this.setState({ amount: e.target.value });
    }
  }
  handleFee() {
    if (this.state.feeCost === 0.0005) { // is fast, change to econ
      this.setState({
        feeCost: 0.0001,
        economicStyle: styles.selectBtn,
        fastStyle: styles.nonSelectBtn
      });
    } else {
      this.setState({
        feeCost: 0.0005,
        fastStyle: styles.selectBtn,
        economicStyle: styles.nonSelectBtn
      });
    }
  }
  handleAddressTo(e) {
    this.setState({
      addressTo: e.target.value
    });
  }
  sendTx() {
    
    if (this.state._wif && this.state.addressTo && this.state.amount && this.state.feeCost) {
      axios.post('http://localhost:8080/send', {
        "wif": this.state._wif,
        "addressTo": this.state.addressTo,
        "amount": this.state.amount,
        "fee": this.state.feeCost
      }).then((response) => {
        document.getElementById('inputAddr').value = '';
        let tx = this.state.transactions;
        tx.unshift(response.data)
        this.setState({ 
          amount: '',
          transactions: tx
        }, () => {
          this.getBalance();
        });
      }).catch((error) => {
        console.log("Error:", error)
      })
    } else {
      alert('Please fill in the right details to send a transaction')
    }
  }

  // send to "2MvzBdxxtdUYXxZhCU7JLGzr4YF6RcT9N4s"
  render() {
    // add states to styles
    let wifStyle = Object.assign({ display: this.state.showInput }, styles.wifInput);
    let addrStyle = Object.assign({ display: this.state.showResult}, styles.addressCard);
    let txHistStyle = Object.assign({ display: this.state.showResult}, styles.txHistory);
    let sendBitStyle = Object.assign({ display: this.state.showResult}, styles.sendBTC);
    
    // map multiple transactions
    
    return (
      <div className="App">
        <div style={wifStyle} className="col-xs-12">
            <h1>Enter Private Key</h1>
            <input key="inputWif" style={styles.input} onChange={this.getAddressT} />
            <h3>Or</h3>
            <a style={styles.newKey} onClick={this.newAddress} key="create" className="btn">Create One</a>
          </div>
        <div style={addrStyle} className="col-sm-6">
          <div className="col-xs-12">
            <div className="col-xs-6">
            <h3>Address</h3>
            <div style={styles.qrStyle}>
              {this.state.qr}
            </div>
            <p>{this.state.address}</p>
            </div>
            <div className="col-xs-6">
            <h3>Balance</h3>
            <h1>{this.state.balance} BTC</h1>
            </div>
            <div className="col-xs-12">
            <h3>Network</h3>
            <p>{this.state.network}</p>
            </div>
          </div>
        </div>
        <div style={txHistStyle} className="col-sm-6">
          <h3 style={{ color: 'white'}}>Transactions</h3>
          {this.state.transactions.map((tx, index) => 
            (<Transaction key={tx} address={this.state.address} transaction={tx} />)
          )}
        </div>
        <div style={sendBitStyle} className="col-sm-6">
          <div className="col-xs-12">
            <div style={styles.inputContainer} className="col-xs-2">
              <h4>Send to:</h4>
            </div>
            <div style={{ paddingLeft: 0 }} className="col-xs-8">
              <input id="inputAddr" onChange={this.handleAddressTo} key="inputAddr" style={styles.sendInput}  />
            </div>  
          </div>
          <div className="col-xs-12">
            <div style={styles.inputContainer} className="col-xs-2">
              <h4>Bitcoin:</h4>
            </div>
            <div style={styles.inputContainer} className="col-xs-3">
              <input id="inputBTC" key="inputBTC" placeholder="0.000000" style={styles.sendInput} onChange={this.handleAmountChange} value={this.state.amount} />
            </div>          
          </div>
          <div className="col-xs-12">
            <div style={styles.inputContainer} className="col-xs-1">
              <h4>Fee:</h4>
            </div>
            <div style={styles.buttonContainer} className="col-xs-6">
              <div className="col-xs-6">
                <a style={this.state.economicStyle} onClick={this.handleFee} className="btn">Economic</a>
              </div>
              <div className="col-xs-6">
                <a style={this.state.fastStyle} onClick={this.handleFee} className="btn">Fast</a>
              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <a style={styles.sendBtn} key="send" onClick={this.sendTx} className="btn">Send</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(App);
