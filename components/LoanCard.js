// components/LoanCard.js
function LoanCard({ loan }) {
    return (
      <div className="bg-gray-100 p-4 mb-4 rounded shadow-md">
        <h3 className="text-lg font-bold mb-2">{loan.purpose}</h3>
        <p>Amount: {loan.amount}</p>
        <p>Duration: {loan.duration} days</p>
        <p>Status: {loan.status}</p>
      </div>
    );
  }
  
  export default LoanCard;
  