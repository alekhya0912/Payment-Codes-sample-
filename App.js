import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import ForgetPassword from "./pages/Authentication/ForgetPassword";
import WelcomePage from "./pages/WelcomePgage/WelcomePage";
import ApprovalRoutes from './routes/ApprovalRoutes';
import AccountBalanceRoutes from './routes/AccountBalanceRoutes';
import TransactionRoutes from './routes/TransactionRoutes';
import ApprovalsPage from "./pages/PaymentApprovals/ApprovalsPage";
import PayrollPaymentRoutes from "./routes/PayrollPaymentRoutes";
import ProtectedLayout from "./common/ProtectedLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/Payroll-payments" element={<PayrollPaymentRoutes />} />
          <Route path="/Approval-page" element={<ApprovalRoutes />} />
          <Route path="/reviewed-batches" element={<ApprovalsPage />} />
          <Route path="/Account-balance-and-history" element={<AccountBalanceRoutes />} />
          <Route path="/Transaction-history" element={<TransactionRoutes />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />}/>
        
      </Routes>
    </div>
  );
}

export default App;
