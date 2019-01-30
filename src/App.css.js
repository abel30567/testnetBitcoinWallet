let wifInput = {
    border: '1px solid #407cff',
    borderRadius: '10px',
    backgroundColor: '#407cff',
    color: 'white',
    position: 'fixed',
    top: '40%',
    left: '35%',
    boxShadow: '0 0 8px #000',
    textAlign: 'center',
    paddingBottom: '25px',
    width: '350px',
};
let input = {
    color: 'black',
    width: '300px',
    height: '30px',
    border: '0px',
    borderColor: 'transparent',
    borderRadius: '5px',
    ':focus': {
        outline: 'none'
      },
}

let addressCard = {
    border: '1px solid transparent',
    width: '45%',
    position: 'fixed',
    left: '20px',
    top: '20px',
    borderRadius: 10,
    boxShadow: '0 0 8px #000',
    textAlign: 'center',
    backgroundColor: '#407cff',
    color: 'white'
}
let txHistory = {
    float: 'right',
    marginRight: '20px',
    paddingRight: 0,
}
let qrStyle = {
    backgroundColor: 'white',
    padding: '7px',
    // marginLeft: '40px',
    marginBottom: '5px',
    
}
let sendBTC = {
    paddingTop: 20,
    border: '1px solid transparent',
    width: '45%',
    position: 'fixed',
    left: '20px',
    top: '53%',
    borderRadius: 10,
    boxShadow: '0 0 8px #000',
    color: '#407cff',
    backgroundColor: 'white'
}
let sendInput = {
    color: 'black',
    width: '100%',
    height: '30px',
    border: '0px',
    borderBottom: '2px solid',
    borderColor: 'black',
    borderRadius: '0px',
    ':focus': {
        outline: 'none'
      },
}

let inputContainer = {
    paddingLeft: 0,
    paddingRight: 0,
    width: '75px',
    display: 'inline-flex'
}
let buttonContainer = {
    paddingLeft: 0,
    paddingRight: 0,
    display: 'inline-flex'
}
let selectBtn = {
    borderRadius: 5,
    backgroundColor: '#407cff',
    color: 'white',
    fontWeight: 'bold',
    width: '100px'
}
let nonSelectBtn = {
    borderRadius: 5,
    backgroundColor: 'white',
    color: '#407cff',
    borderColor: '#407cff',
    fontWeight: 'bold',
    width: '100px'
}
let sendBtn = {
    borderRadius: 5,
    backgroundColor: 'rgb(58, 204, 138)',
    color: 'white',
    borderColor: 'rgb(58, 204, 138)',
    fontWeight: 'bold',
    width: '100px',
    float: 'right',
    fontSize: '17px',
    marginBottom: '20px'
}
let newKey = {
  borderRadius: 5,
  backgroundColor: 'rgb(58, 204, 138)',
  color: 'white',
  borderColor: 'rgb(58, 204, 138)',
  fontWeight: 'bold',
  width: '300px',
  fontSize: '17px',
  marginBottom: '20px'
}
let receiveBTC = {
  textAlign: 'center',
  border: '1px solid transparent',
  width: '45%',
  position: 'fixed',
  left: '20px',
  bottom: '448px',
  borderRadius: 10,
  boxShadow: '0 0 8px #000',
  color: '#407cff',
  backgroundColor: 'white'
}
export default { 
    wifInput, 
    input, 
    addressCard, 
    txHistory,
    qrStyle,
    sendBTC,
    sendInput,
    inputContainer,
    selectBtn,
    nonSelectBtn,
    buttonContainer,
    sendBtn,
    newKey,
    receiveBTC
};