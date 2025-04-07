// api/microfinance.js
import Web3 from 'web3';
import { Microfinance } from '../contracts/Microfinance.json';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_PROJECT_ID'));
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new web3.eth.Contract(Microfinance.abi, contractAddress);

export async function requestLoan(amount, duration, purpose) {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  const tx = await contract.methods.requestLoan(amount, duration, purpose).send({ from: account });
  return tx;
}

export async function getLoans() {
  const loans = await contract.methods.getLoanCount().call();
  const loanData = [];
  for (let i = 0; i < loans; i++) {
    const loan = await contract.methods.getLoan(i).call();
    loanData.push(loan);
  }
  return loanData;
}
