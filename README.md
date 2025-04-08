# 🌍 Decentralized Microfinance Platform

A full-stack decentralized application (DApp) built to revolutionize microfinance using blockchain technology. This platform allows borrowers to request loans and lenders to approve and monitor loans transparently using smart contracts on Ethereum. Built with **Solidity**, **Hardhat**, **Node.js**, **Next.js**, **Vite**, and styled using **Tailwind CSS**.

---

## 🚀 Features

- Borrower loan request & status tracking
- Lender loan approval and repayment monitoring
- Credit score tracking using smart contracts
- Secure wallet connection using `ethers.js`
- Transparent & tamper-proof loan ledger
- Admin controls for fund distribution and user management

---

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity, OpenZeppelin
- **Development Framework:** Hardhat
- **Blockchain Interaction:** ethers.js
- **Frontend:** Next.js, Vite
- **Styling:** Tailwind CSS
- **Environment Variables:** dotenv

---

## 📦 Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/decentralized-microfinance-platform.git
cd decentralized-microfinance-platform
```

### 2️⃣ Create `.env` File

Create a `.env` file in the root of the project and add the following:

```
ETHERSCAN_API_KEY=your_etherscan_api_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-key
PRIVATE_KEY=your_wallet_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here
```

### 3️⃣ Install Dependencies

```bash
npm install hardhat @openzeppelin/contracts ethers @nomicfoundation/hardhat-toolbox dotenv
```

> ⚠️ If you run into installation errors due to missing packages, install them individually and retry the command.

### 4️⃣ Compile Smart Contracts

```bash
npx hardhat compile
```

### 5️⃣ Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 6️⃣ Run Frontend Locally

```bash
npm run dev
```

Visit your DApp at [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Preview

> Add preview images here like screenshots or gif walkthroughs

---

## 📄 Project Docs

- 📌 [Features, Benefits, Challenges & Solutions Presentation (PDF)]

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

[MIT](LICENSE)