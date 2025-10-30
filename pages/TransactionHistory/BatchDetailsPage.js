import React from "react";
import "./BatchDetailsPageCss.css"
import printStatement from "./printStatement";
// import Print from "./Print";

function BatchDetailsPage({ batch,onBack}){
    return(
        <section>
            <div className="header-row">
                <div>
                    {/* <h1 className="history-page-title">Batch Details</h1>
                    <div className="muted">
                    {batch.id} . Currency: {batch.currency} . {batch.transactions.length} transaction
                    {batch.transactions.length > 1 ? "s":" "}
                    </div> */}
                </div>
                <div className="header-actions">
                    <button className="history-btn ghost" onClick={()=>printStatement(batch)}>Print</button>
                    <button className="history-btn ghost" onClick={onBack}>Back</button>
                </div>
            </div>


            <div className="card history-details-header">
                <div className="details-title-section">
                    <div className="details-batch-id">Batch ID:{batch.id}</div>
                    <h3 className="details-title">{batch.name}</h3>
                    <div className={`status-badge status-${batch.status}`}>{batch.status.toUpperCase()}</div>
                </div>
                <div className="history-details-amount">
                    <div className="history-amount-value">{batch.totalAmount}</div>
                    <div className="history-amount-label">Total Amount ({batch.currency})</div>
                </div>
            </div>


            <div className="history-details-metrics">
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{batch.employees}</div>
                        <div className="history-metric-label">Employees</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{batch.debitAccount}</div>
                        <div className="history-metric-label">Debit Account</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{batch.createdBy}</div>
                        <div className="history-metric-label">Created By</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{batch.date}</div>
                        <div className="history-metric-label">Created Date</div>
                    </div>
                </div>
            </div>

            
            <div className="card table-card">
                <h4 className="table-title">Transactions</h4>
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Txn ID</th>
                                <th>Employee</th>
                                <th>Account</th>
                                <th className="ta-right">Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batch.transactions.map((t)=>(
                                <tr key={t.id}>
                                    <td>{t.date}</td>
                                    <td>{t.id}</td>
                                    <td>{t.employee}</td>
                                    <td>{t.account}</td>
                                    <td className="ta-right">{t.amount}</td>
                                    <td>
                                        <span className={`status-badge status-${t.status}`}>
                                            {t.status.toUpperCase()}
                                            </span>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default BatchDetailsPage;