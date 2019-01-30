const sTransaction = {
    backgroundColor: 'white',
    borderRadius: '10px',
    color: '#252260',
    boxShadow: '0 0 3px #ccc',
    marginBottom: '15px',
    paddingTop: 10,
};

const sentIcon = {
    color: 'white',
    fontSize: 28,
    border: '3px solid white',
    borderRadius: 40,
    padding: '8px 10px 6px 6px',
    backgroundColor: '#e9b825',
    boxShadow: 'rgb(204, 204, 204) 0px 0px 10px'

}
const receivedIcon = {
    color: 'rgb(58, 204, 138)',
    fontSize: 50,
    borderRadius: 40,
    paddingLeft: 3.5,
    width: 50,
    height: 50,
    boxShadow: 'rgb(204, 204, 204) 0px 0px 10px'
}
const transactionCont ={ 
    textAlign: 'center', 
    paddingRight: 0, 
    paddingLeft: 0 
}
const link = {
    color: 'rgb(155, 166, 178)',
    ':hover': {
        textDecoration: 'none',
        color: 'rgb(155, 166, 178)'
      },
}
export default { 
    sTransaction, 
    sentIcon,
    receivedIcon,
    transactionCont,
    link
}