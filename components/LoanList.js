// components/LoanList.js
import LoanCard from './LoanCard';

function LoanList({ loans }) {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">Loans</h2>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id}>
            <LoanCard loan={loan} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LoanList;
