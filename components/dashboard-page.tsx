"use client";
import LoanRequestForm from './loan-request-form';
import LoansList from './loans-list';
import { UserStats } from './user-stats';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <UserStats account="example-account" />
      <LoanRequestForm />
      <LoansList />
    </div>
  );
}