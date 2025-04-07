const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Microfinance", () => {
  let microfinance
  let owner
  let borrower

  beforeEach(async () => {
    ;[owner, borrower] = await ethers.getSigners()

    const Microfinance = await ethers.getContractFactory("Microfinance")
    microfinance = await Microfinance.deploy()
  })

  describe("Loan Requests", () => {
    it("Should allow users to request loans", async () => {
      const amount = ethers.parseEther("1")
      const duration = 30 // 30 days
      const purpose = "Business expansion"

      await expect(microfinance.connect(borrower).requestLoan(amount, duration, purpose))
        .to.emit(microfinance, "LoanRequested")
        .withArgs(0, borrower.address, amount, duration)

      const loanCount = await microfinance.getLoanCount()
      expect(loanCount).to.equal(1)

      const loan = await microfinance.getLoan(0)
      expect(loan.borrower).to.equal(borrower.address)
      expect(loan.amount).to.equal(amount)
      expect(loan.duration).to.equal(duration)
      expect(loan.purpose).to.equal(purpose)
      expect(loan.status).to.equal(0) // Pending
    })

    it("Should reject loan requests with invalid parameters", async () => {
      await expect(microfinance.connect(borrower).requestLoan(0, 30, "Purpose")).to.be.revertedWith(
        "Loan amount must be greater than 0",
      )

      await expect(microfinance.connect(borrower).requestLoan(ethers.parseEther("1"), 0, "Purpose")).to.be.revertedWith(
        "Loan duration must be greater than 0",
      )

      await expect(microfinance.connect(borrower).requestLoan(ethers.parseEther("1"), 30, "")).to.be.revertedWith(
        "Loan purpose cannot be empty",
      )
    })
  })

  describe("Loan Approval", () => {
    beforeEach(async () => {
      await microfinance.connect(borrower).requestLoan(ethers.parseEther("1"), 30, "Business expansion")
    })

    it("Should allow owner to approve loans", async () => {
      await expect(microfinance.connect(owner).approveLoan(0))
        .to.emit(microfinance, "LoanApproved")
        .withArgs(0, borrower.address, ethers.parseEther("1"))

      const loan = await microfinance.getLoan(0)
      expect(loan.status).to.equal(1) // Approved
      expect(loan.dueDate).to.be.gt(0)
    })

    it("Should not allow non-owners to approve loans", async () => {
      await expect(microfinance.connect(borrower).approveLoan(0)).to.be.revertedWithCustomError(
        microfinance,
        "OwnableUnauthorizedAccount",
      )
    })
  })

  describe("Loan Repayment", () => {
    beforeEach(async () => {
      await microfinance.connect(borrower).requestLoan(ethers.parseEther("1"), 30, "Business expansion")
      await microfinance.connect(owner).approveLoan(0)
    })

    it("Should allow borrowers to repay loans", async () => {
      await expect(microfinance.connect(borrower).repayLoan(0, { value: ethers.parseEther("1") }))
        .to.emit(microfinance, "LoanRepaid")
        .withArgs(0, borrower.address)

      const loan = await microfinance.getLoan(0)
      expect(loan.status).to.equal(2) // Repaid

      const creditScore = await microfinance.getUserCreditScore(borrower.address)
      expect(creditScore).to.equal(10)
    })

    it("Should not allow non-borrowers to repay loans", async () => {
      await expect(microfinance.connect(owner).repayLoan(0, { value: ethers.parseEther("1") })).to.be.revertedWith(
        "Only borrower can repay",
      )
    })

    it("Should require sufficient funds for repayment", async () => {
      await expect(microfinance.connect(borrower).repayLoan(0, { value: ethers.parseEther("0.5") })).to.be.revertedWith(
        "Insufficient repayment amount",
      )
    })
  })
})

