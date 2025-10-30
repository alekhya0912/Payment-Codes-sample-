import React from 'react';
import { Users } from 'lucide-react';
import './PayrollHeader.css';
import '../../../assets/styles/PayrollPayment.css';

const PayrollHeader = () => (
    <header className="pageHeader">
        <h1 className="pageTitle">
            <Users />
            Payroll Dashboard
        </h1>
        <p className="pageSubtitle">
            This application manages payroll batches and employee assignments.
        </p>
    </header>
);

export default PayrollHeader;