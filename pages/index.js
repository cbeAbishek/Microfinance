// pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoanForm from '../components/LoanForm';

function Home() {
  return (
    <div>
      <Header />
      <main className="max-w-md mx-auto p-4">
        <LoanForm />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
