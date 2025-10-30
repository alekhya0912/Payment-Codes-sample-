import React from "react";
import "./BatchesPageCss.css"


function BatchesPage({ batch, onView, showActions }) {
    return (
        <div className="batches-container">
        <article className="card batch-card">
            <div className="batch-card-header">
                <div className="batch-card-title">
                    <div className="history-batch-id">ID: {batch.id}</div>
                    <h3>{batch.name}</h3>
                    <div className={`status-badge status-${batch.status}`}>
                        {batch.status.toUpperCase()}
                    </div>
                </div>
                <div className="batch-card-amount">{batch.amount}</div>
            </div>

        <div className="batch-card-body">
            <div className="batch-detail"><span className="history-detail-label">Employees</span><span className="history-detail-value>">{batch.employees}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Currency</span><span className="history-detail-value>">{batch.currency}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Created By</span><span className="history-detail-value>">{batch.createdBy}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Date</span><span className="history-detail-value>">{batch.date}</span></div>
            <div className="batch-detail-span-2">
                <span className="history-detail-label">Debit Account</span>
                <span className="history-detail-value mono">{batch.debitAccount}</span>
            </div>
            <br></br>

            {batch.description && (
                <div className="desc-wrap">
                    <span className="desc-pipe" aria-hidden="true"></span>
                    <span className="desc-field">{batch.description}</span>
                    </div>
            )}
        </div>

        <div className="batch-card-footer" style={ { display:"flex", gap: 8}}>
            <button className="history-btn btn-outline" onClick={onView}>View Details</button>
            {showActions && (
                    <>
                    <button className="history-btn ghost">Edit</button>
                    <button className="history-btn danger">Delete</button>
                    </>
                )}
        </div>
        </article>
        </div>
    );
}

export default BatchesPage;