import React, { Component } from 'react';
import axios from 'axios';
import styles from './Transaction.css';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: 0,
      icon: '',
    };
    
  }
  componentDidMount() {  
    // Get transaction info
    axios.get(`http://localhost:8080/tx/${this.props.transaction}`, { crossdomain: true })
    .then((res) => {
      console.log(res);
      let btime = res.data.time;
      let date = String(new Date(btime *1000));
      const dateArr = date.split(' ');
      // is sent
      if (String(res.data.vin[0].addr) === String(this.props.address)) {
        this.setState({
            month: dateArr[1],
            day: dateArr[2],
            txid: res.data.txid,
            confirmations: res.data.confirmations,
            fee: res.data.fees,
            vin: res.data.vin,
            vout: res.data.vout,
            style: styles.sTransaction,
            value: <h4 style={{color: 'rgb(78, 92, 110)'}}><span>-<i className="fa fa-btc"></i> {String((Number(res.data.vout[0].value) + Number(res.data.fees)).toFixed(6))}</span></h4>,
            action: 'Sent Bitcoin',
            fromTo: 'To: ' + res.data.vout[0].scriptPubKey.addresses[0],
            icon: <i style={styles.sentIcon} className="fa fa-paper-plane" aria-hidden="true"></i>
          });
      } else { // was received
        // where is change address in the UTXO output
        if (String(this.props.address) === String(res.data.vout[0].scriptPubKey.addresses[0])) {
          this.setState({
            month: dateArr[1],  
            day: dateArr[2],
            txid: res.data.txid,
            confirmations: res.data.confirmations,
            fee: res.data.fees,
            vin: res.data.vin,
            vout: res.data.vout,
            style: styles.sTransaction,
            value: <h4 style={{color: 'rgb(78, 92, 110)'}}><span>+<i className="fa fa-btc"></i> {Number(res.data.vout[0].value).toFixed(6)}</span></h4>,
            fromTo: 'From: ' + res.data.vout[1].scriptPubKey.addresses[0],
            action: 'Received Bitcoin',
            icon: <i style={styles.receivedIcon} className="fa fa-check-circle" aria-hidden="true"></i>
          });
        } else {
          this.setState({
            month: dateArr[1],  
            day: dateArr[2],
            txid: res.data.txid,
            confirmations: res.data.confirmations,
            fee: res.data.fees,
            vin: res.data.vin,
            vout: res.data.vout,
            style: styles.sTransaction,
            value: <h4 style={{color: 'rgb(78, 92, 110)'}}><span>+<i className="fa fa-btc"></i> {Number(res.data.vout[1].value).toFixed(6)}</span></h4>,
            fromTo: 'From: ' + res.data.vout[0].scriptPubKey.addresses[0],
            action: 'Received Bitcoin',
            icon: <i style={styles.receivedIcon} className="fa fa-check-circle" aria-hidden="true"></i>
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  render() {
    
    return (
      <div style={this.state.style} className="Transaction col-xs-12">
        <div style={styles.transactionCont} className="col-xs-2">
          <h4 style={{color: 'rgb(78, 92, 110)'}}>{this.state.month}</h4>
          <h3 style={{color: 'rgb(155, 166, 178)'}}>{this.state.day}</h3>
        </div>
        <div style={{ paddingTop: 15}} className="col-xs-2">
          {this.state.icon}
        </div>
        <div className="col-xs-5">
          <h4 style={{color: 'rgb(78, 92, 110)'}} >{this.state.action}</h4>
          <p style={{color: 'rgb(155, 166, 178)'}}>{this.state.fromTo} </p>
        </div>
        <div style={styles.transactionCont} className="col-xs-3">
          {this.state.value}
          <small><a style={styles.link} href={`https://live.blockcypher.com/btc-testnet/tx/${this.state.txid}`}>View Transaction</a></small>
        </div>
      </div>
    );
  }
}

export default Transaction;
