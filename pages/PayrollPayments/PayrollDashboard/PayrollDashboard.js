import React, { useState, useCallback, useEffect } from 'react';
import './PayrollDashboard.css';
import '../../../assets/styles/PayrollPayment.css';
import * as api from '../../../services/payrollapi';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import PayrollHeader from '../ui/PayrollHeader';
import ConfirmModal from '../ui/ConfirmModal';
import EditBatchModal from '../ui/EditBatchModal';
import AddItemForm from '../forms/AddItemForm';
import BulkUploadForm from '../forms/BulkUploadForm';
import AddEmployeeForm from '../forms/AddEmployeeForm';
import EmployeeList from '../views/EmployeeList';
import BatchList from '../views/BatchList';
import InitiatePaymentModal from '../payment/InitiatePaymentModal';

const PayrollDashboard = () => {
    const [batches, setBatches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, data: null, type: null, title: '', message: '' });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [editModalState, setEditModalState] = useState({ isOpen: false, batch: null });
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [batchesData, employeesData, accountsData] = await Promise.all([
                api.getBatches(),
                api.getEmployees(),
                api.getBankAccounts()
            ]);
            setBatches(batchesData.sort((a, b) => b.id - a.id));
            setEmployees(employeesData);
            setBankAccounts(accountsData);
        } catch (err) {
            setError(`Failed to load data: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const addBatch = useCallback(async (name) => {
        setError(null);
        try {
            const newBatch = await api.createBatch(name);
            setBatches(prev => [newBatch, ...prev]);
        } catch (err) {
            setError(`Failed to add batch: ${err.message}`);
            console.error(err);
        }
    }, []);
    const addEmployee = useCallback(async (employeeData) => {
        setError(null);
        try {
            const dataToSend = {
                ...employeeData,
                batchId: employeeData.batchId === '' ? null : employeeData.batchId
            };
            const newEmployee = await api.addEmployee(dataToSend);
            setEmployees(prev => [newEmployee, ...prev]);
        } catch (err) {
            setError(`Failed to add employee: ${err.message}`);
            console.error(err);
        }
    }, []);

    const handleBulkAdd = useCallback(async (file) => {
        setLoading(true);
        setError(null);
        try {
            await api.bulkUploadEmployees(file);
            await fetchData();
        } catch (err) {
            setError(`Bulk upload failed: ${err.message}`);
            console.error(err);
            setLoading(false);
        }
    }, [fetchData]);
    const assignEmployeeToBatch = useCallback(async (employeeId, batchId) => {
        setError(null);
        try {
            const updatedEmployee = await api.assignEmployeeToBatch(employeeId, batchId);
            setEmployees(prev => prev.map(emp =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            ));
        } catch (err) {
            setError(`Failed to assign employee: ${err.message}`);
            console.error(err);
        }
    }, []);
    const unassignEmployeeFromBatch = useCallback(async (employeeId) => {
        setError(null);
        try {
            const updatedEmployee = await api.unassignEmployee(employeeId);
            setEmployees(prev => prev.map(emp =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            ));
        } catch (err) {
            setError(`Failed to unassign employee: ${err.message}`);
            console.error(err);
        }
    }, []);
    const initiatePayment = useCallback((batch) => {
        const batchEmployees = employees.filter(e => e.batchId === batch.id);
        if (batchEmployees.length === 0) {
            setError("Cannot initiate payment: No employees are assigned to this batch.");
            return;
        }
        setSelectedBatch(batch);
        setIsPaymentModalOpen(true);
        setError(null);
    }, [employees]);
    const handleConfirmInitiatePayment = useCallback(async (batch, paymentDetails) => {
        setIsPaymentProcessing(true);
        setError(null);
        try {
            const updatedBatch = await api.initiatePayment(batch.id, paymentDetails);
            setBatches(prevBatches => prevBatches.map(b =>
                b.id === updatedBatch.id ? updatedBatch : b
            ));
            setIsPaymentModalOpen(false);
            setSelectedBatch(null);
        } catch (err) {
            setError(`Failed to initiate payment: ${err.message}`);
            console.error(err);
        } finally {
            setIsPaymentProcessing(false);
        }
    }, []);
    const handleDraftPayment = useCallback((batch, paymentDetails) => {
        console.log("Draft details:", paymentDetails);
        setIsPaymentModalOpen(false);
        setSelectedBatch(null);
        setError(null);
    }, []);
    const deleteBatch = useCallback((batch) => {
        const assignedCount = employees.filter(e => e.batchId === batch.id).length;
        setModalState({
            isOpen: true,
            type: 'delete_batch',
            data: batch,
            title: `Delete Batch: ${batch.name}`,
            message: `Are you sure you want to permanently delete the batch "${batch.name}"? This action will unassign ${assignedCount} employee(s).`
        });
    }, [employees]);
    const handleConfirmDeleteBatch = useCallback(async (batch) => {
        setError(null);
        try {
            await api.deleteBatch(batch.id);
            setBatches(prev => prev.filter(b => b.id !== batch.id));
            setEmployees(prev => prev.map(emp =>
                emp.batchId === batch.id ? { ...emp, batchId: null } : emp
            ));
            handleModalClose();
        } catch (err) {
            setError(`Failed to delete batch: ${err.message}`);
            console.error(err);
        }
    }, []);
    const deleteEmployee = useCallback((employee) => {
        setModalState({
            isOpen: true,
            type: 'delete_employee',
            data: employee,
            title: `Delete Employee: ${employee.name}`,
            message: `Are you sure you want to permanently delete the employee "${employee.name}"? This cannot be undone.`
        });
    }, []);
    const handleConfirmDeleteEmployee = useCallback(async (employee) => {
        setError(null);
        try {
            await api.deleteEmployee(employee.id);
            setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
            handleModalClose();
        } catch (err) {
            setError(`Failed to delete employee: ${err.message}`);
            console.error(err);
        }
    }, []);
     const handleOpenEditModal = useCallback((batch) => {
        setEditModalState({ isOpen: true, batch: batch });
    }, []);
    const handleCloseEditModal = useCallback(() => {
        setEditModalState({ isOpen: false, batch: null });
    }, []);
    const handleConfirmEditBatch = useCallback(async (batchId, newName) => {
        setError(null);
        try {
            const updatedBatch = await api.updateBatchName(batchId, newName);
            setBatches(prev =>
                prev.map(batch =>
                    batch.id === updatedBatch.id ? updatedBatch : batch
                )
            );
            handleCloseEditModal();
        } catch (err) {
            setError(`Failed to update batch name: ${err.message}`);
            console.error(err);
        }
    }, [handleCloseEditModal]);
    const handleModalConfirm = () => {
        if (!modalState.data || !modalState.type) return;
        if (modalState.type === 'delete_batch') {
            handleConfirmDeleteBatch(modalState.data);
        } else if (modalState.type === 'delete_employee') {
            handleConfirmDeleteEmployee(modalState.data);
        }
    };
    const handleModalClose = () => {
        setModalState({ isOpen: false, data: null, type: null, title: '', message: '' });
    };

    const handlePaymentModalClose = () => {
        setIsPaymentModalOpen(false);
        setSelectedBatch(null);
        setIsPaymentProcessing(false);
    };
    if (loading) {
        return <LoadingState />;
    }
    return (
        <div className="dashboard">
            <PayrollHeader />
            {error && <ErrorState message={error} />}
            <div className="formGrid">
                <AddItemForm
                    placeholder="e.g., Q4 Marketing Team"
                    buttonText="Add New Batch"
                    onAdd={addBatch}
                />
                <BulkUploadForm onBulkAdd={handleBulkAdd} />
                <AddEmployeeForm
                    batches={batches}
                    onAdd={addEmployee}
                />
            </div>
            <div className="mainContentGrid">
                <div className="employeeListColumn">
                    <EmployeeList
                        employees={employees}
                        deleteEmployee={deleteEmployee}
                        batches={batches}
                    />
                </div>

                <div className="batchListColumn">
                    <BatchList
                        batches={batches}
                        employees={employees}
                        deleteBatch={deleteBatch}
                        assignEmployeeToBatch={assignEmployeeToBatch}
                        initiatePayment={initiatePayment}
                        onEditBatch={handleOpenEditModal}
                        unassignEmployee={unassignEmployeeFromBatch}
                    />
                </div>
            </div>
            <ConfirmModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                onConfirm={handleModalConfirm}
                onClose={handleModalClose}
            />
            <EditBatchModal
                isOpen={editModalState.isOpen}
                batch={editModalState.batch}
                onConfirm={handleConfirmEditBatch}
                onClose={handleCloseEditModal}
            />
            <InitiatePaymentModal
                isOpen={isPaymentModalOpen}
                batch={selectedBatch}
                employees={employees.filter(e => e.batchId === selectedBatch?.id)}
                bankAccounts={bankAccounts}
                onConfirm={handleConfirmInitiatePayment}
                onDraft={handleDraftPayment}
                onClose={handlePaymentModalClose}
                isProcessing={isPaymentProcessing}
            />
        </div>
    );
};
export default PayrollDashboard;
