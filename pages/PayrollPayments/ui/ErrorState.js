import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ErrorState.css';
import '../../../assets/styles/PayrollPayment.css';

const ErrorState = ({ message }) => (
    <div className="errorBox">
        <AlertTriangle />
        <p>{message}</p>
    </div>
);

export default ErrorState;