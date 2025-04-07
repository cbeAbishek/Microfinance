// pages/loans.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoanList from '../components/LoanList';

function Loans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch('/api/microfinance/loans')
      .then((response) => response.json())
      .then((data) => setLoans(data));
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-4">
        <LoanList loans={loans} />
      </main>
      <Footer />
    </div>
  );
}

export default Loans;
