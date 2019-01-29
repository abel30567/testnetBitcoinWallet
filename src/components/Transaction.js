import React, { Component } from 'react';
import axios from 'axios';
import styles from './Transaction.css';

// want confirmations
// transaction id
// address sent to
// fees
// was sent or received?
// if was sent, vin address === vout address




class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: 0,
    };
    
  }
  componentDidMount() {  
    axios.get(`http://localhost:8080/tx/${this.props.transaction}`, { crossdomain: true })
    .then((res) => {
      console.log(res);
      console.log('props', this.props.address)
      // is sent
      if (String(res.data.vin[0].addr) === String(this.props.address)) {
        this.setState({
            txid: res.data.txid,
            confirmations: res.data.confirmations,
            fee: res.data.fees,
            vin: res.data.vin,
            vout: res.data.vout,
            style: styles.sentTransaction,
            value: res.data.vout[0].value,
            action: 'sent'
          });
      } else { // was received
        this.setState({
            txid: res.data.txid,
            confirmations: res.data.confirmations,
            fee: res.data.fees,
            vin: res.data.vin,
            vout: res.data.vout,
            style: styles.receivedTransaction,
            value: res.data.vout[0].value,
            action: 'received'
          });
      }
      
    })
    .catch((err) => {
      console.log(err);
    })
  }
  componentWillReceiveProps(nextProps) {
      console.log('nextprops', nextProps);
  }
  render() {
    
    return (
      <div style={this.state.style} className="Transaction col-xs-12">
        <h5>Transaction Id: {this.state.txid}</h5>
        <p>Confirmations: {this.state.confirmations}</p>
        <p> You {this.state.action} {this.state.value} BTC</p>
        <p>Fee: {this.state.fee} BTC</p>

      </div>
    );
  }
}

export default Transaction;
