// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Microfinance
 * @dev A simple microfinance contract for requesting and managing loans
 */
contract Microfinance is Ownable, Pausable {
    enum LoanStatus { Pending, Approved, Repaid, Rejected }
    
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 duration; // in days
        string purpose;
        LoanStatus status;
        uint256 dueDate;
    }
    
    // All loans in the system
    Loan[] public loans;
    
    // Mapping from user address to their loan IDs
    mapping(address => uint256[]) public userLoans;
    
    // Mapping to track user credit scores (simplified)
    mapping(address => uint256) public creditScores;
    
    // Events
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 duration);
    event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Request a new loan
     * @param _amount Amount of the loan in wei
     * @param _duration Duration of the loan in days
     * @param _purpose Purpose of the loan
     * @return loanId The ID of the newly created loan
     */
    function requestLoan(uint256 _amount, uint256 _duration, string memory _purpose) 
        external 
        whenNotPaused 
        returns (uint256) 
    {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(_duration > 0, "Loan duration must be greater than 0");
        require(bytes(_purpose).length > 0, "Loan purpose cannot be empty");
        
        uint256 loanId = loans.length;
        
        loans.push(Loan({
            borrower: msg.sender,
            amount: _amount,
            duration: _duration,
            purpose: _purpose,
            status: LoanStatus.Pending,
            dueDate: 0
        }));
        
        userLoans[msg.sender].push(loanId);
        
        emit LoanRequested(loanId, msg.sender, _amount, _duration);
        
        return loanId;
    }
    
    /**
     * @dev Approve a pending loan (only owner)
     * @param _loanId ID of the loan to approve
     */
    function approveLoan(uint256 _loanId) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        require(_loanId < loans.length, "Invalid loan ID");
        Loan storage loan = loans[_loanId];
        
        require(loan.status == LoanStatus.Pending, "Loan is not pending");
        
        loan.status = LoanStatus.Approved;
        loan.dueDate = block.timestamp + (loan.duration * 1 days);
        
        // In a real implementation, this would transfer funds to the borrower
        // payable(loan.borrower).transfer(loan.amount);
        
        emit LoanApproved(_loanId, loan.borrower, loan.amount);
    }
    
    /**
     * @dev Repay a loan
     * @param _loanId ID of the loan to repay
     */
    function repayLoan(uint256 _loanId) 
        external 
        payable 
        whenNotPaused 
    {
        require(_loanId < loans.length, "Invalid loan ID");
        Loan storage loan = loans[_loanId];
        
        require(loan.borrower == msg.sender, "Only borrower can repay");
        require(loan.status == LoanStatus.Approved, "Loan is not approved");
        require(msg.value >= loan.amount, "Insufficient repayment amount");
        
        loan.status = LoanStatus.Repaid;
        
        // Update credit score (simplified)
        creditScores[msg.sender] += 10;
        
        emit LoanRepaid(_loanId, loan.borrower);
        
        // Refund excess payment if any
        if (msg.value > loan.amount) {
            payable(msg.sender).transfer(msg.value - loan.amount);
        }
    }
    
    /**
     * @dev Get the total number of loans in the system
     * @return The total number of loans
     */
    function getLoanCount() external view returns (uint256) {
        return loans.length;
    }
    
    /**
     * @dev Get a specific loan by ID
     * @param _loanId ID of the loan to retrieve
     * @return The loan details
     */
    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        require(_loanId < loans.length, "Invalid loan ID");
        return loans[_loanId];
    }
    
    /**
     * @dev Get the number of loans for a specific user
     * @param _user Address of the user
     * @return The number of loans for the user
     */
    function getUserLoanCount(address _user) external view returns (uint256) {
        return userLoans[_user].length;
    }
    
    /**
     * @dev Get a user's loan at a specific index
     * @param _user Address of the user
     * @param _index Index of the loan in the user's loan array
     * @return The loan details
     */
    function getUserLoanAtIndex(address _user, uint256 _index) external view returns (Loan memory) {
        require(_index < userLoans[_user].length, "Invalid index");
        uint256 loanId = userLoans[_user][_index];
        return loans[loanId];
    }
    
    /**
     * @dev Get a user's credit score
     * @param _user Address of the user
     * @return The user's credit score
     */
    function getUserCreditScore(address _user) external view returns (uint256) {
        return creditScores[_user];
    }
    
    /**
     * @dev Pause the contract (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}

