import React, { useState, useEffect } from 'react';
import { DollarSign, X, Loader, Send, Eye } from 'lucide-react';
import PaymentPreview from './PaymentPreview';
import './InitiatePaymentModal.css';
import '../../../assets/styles/PayrollPayment.css';
const InitiatePaymentModal = ({ isOpen, batch, employees, bankAccounts, onConfirm, onDraft, onClose, isProcessing }) => {
    // debitAccount state now stores the selected account *NUMBER* string
    const [debitAccount, setDebitAccount] = useState('');
    const [selectedBalance, setSelectedBalance] = useState(null);

    const [payrollType, setPayrollType] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setDebitAccount('');
            setSelectedBalance(null);
            setPayrollType('');
            setCurrency('INR');
            setIsPreviewVisible(false);
        }
    }, [isOpen, bankAccounts]);

    if (!isOpen || !batch) return null;

    const isBatchEmpty = employees.length === 0;
    const isFormValid = debitAccount.trim() !== '' && !isBatchEmpty;

    const paymentDetails = {
        debitAccount: debitAccount.trim(),
        payrollType,
        currency,
        batchId: batch.id,
        batchName: batch.name,
        date: new Date().toLocaleDateString('en-US')
    };

    const handleSubmit = () => {
        if (isFormValid) {
            onConfirm(batch, paymentDetails);
        }
    };

    const handleDraft = () => {
        onDraft(batch, paymentDetails);
    };

    const handleAccountChange = (e) => {
        const selectedAccountNumber = e.target.value;
        setDebitAccount(selectedAccountNumber);

        if (selectedAccountNumber) {
            // Find the account based on accountNumber from the DTO
            const account = bankAccounts.find(acc => acc.accountNumber === selectedAccountNumber);
            setSelectedBalance(account ? account.balance : null); // Handle case where account might not be found
        } else {
            setSelectedBalance(null);
        }
    };

    return (
        <div className="paymentModalOverlay">
            <div className="paymentModalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">
                        <DollarSign />
                        Initiate Payment: {batch.name}
                    </h3>
                    <button onClick={onClose} className="closeButton" disabled={isProcessing}>
                        <X />
                    </button>
                </div>

                {isBatchEmpty && (
                     <div className="batchEmptyError">
                         <p><b>Cannot submit payment:</b> The batch has no assigned employees.</p>
                     </div>
                )}

                <div className="modalBodyGrid">
                    <div className="formColumn">
                        <h4 className="columnTitle">Payment Details</h4>

                        <div className="formGroup">
                            <label>Batch ID/No. / Name</label>
                            <input type="text" value={batch.name} disabled />
                        </div>

                        {/* --- MODIFIED Select Dropdown --- */}
                        <div className="formGroup">
                            <label htmlFor="debitAccount">Debit Account*</label>
                            <select
                                id="debitAccount"
                                value={debitAccount} // Value should be the accountNumber string
                                onChange={handleAccountChange}
                                required
                            >
                                <option value="">-- Select an account --</option>
                                {/* Map over the bankAccounts prop */}
                                {bankAccounts && bankAccounts.map(account => (
                                    // Use accountNumber for value, and combine name/number for display
                                    <option key={account.id} value={account.accountNumber}>
                                        {account.accountName ? `${account.accountName} (${account.accountNumber})` : account.accountNumber}
                                    </option>
                                ))}
                            </select>
                            {/* Available Balance Display */}
                            {selectedBalance !== null && (
                                <p className="availableBalance">
                                    {/* Assuming currency is always INR for balance display for now */}
                                    Available Balance: INR {selectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            )}
                        </div>
                        {/* --- END MODIFICATION --- */}


                        <div className="formGroup">
                            <label htmlFor="payrollType">Payroll Type</label>
                            <input 
                                 type="text"
                                 id="payrollType"
                                 value={payrollType}
                                 onChange={(e) => setPayrollType(e.target.value)}
                                 placeholder="e.g., Monthly Salary, Bonus"
                                 required
                                 />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="currency">Currency</label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        <div className="formGroup">
                            <label>Date (Initiation)</label>
                            <input type="text" value={new Date().toLocaleDateString('en-US')} disabled />
                        </div>
                    </div>

                    <div className="previewColumn">
                        {isPreviewVisible ? (
                            <PaymentPreview batch={batch} employees={employees} paymentDetails={paymentDetails} />
                        ) : (
                            <div className="previewPlaceholder">
                                <p>Click 'Show Preview' to generate the payment summary.</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsPreviewVisible(prev => !prev)}
                            className="button previewButton"
                        >
                            <Eye />
                            {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    </div>
                </div>

                <div className="modalFooter">
                    <button
                        onClick={handleDraft}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Draft
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isProcessing}
                        className="button button-success"
                    >
                        {isProcessing ? (
                            <>
                                <Loader className="loader" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send />
                                Submit Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitiatePaymentModal;