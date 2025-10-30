import React from "react";
import "./SearchAndKPICss.css";

function KPIRow({stats}){
    const nfUSD=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD", maximumFractionDigits:0});
    const nfINR=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits: 0});

    return(
        <div className="kpi-row">
            <div className="kpi-card">
                <div className="kpi-value">{stats.total}</div>
                <div className="kpi-label">Total Batches</div>
            </div>

            <div className="kpi-card">
                <div className="kpi-value">{stats.pending}</div>
                <div className="kpi-label">Pending</div>
            </div>

            <div className="kpi-card">
                <div className="kpi-value">{stats.approved}</div>
                <div className="kpi-label">Approved</div>
            </div>

            <div className="kpi-card">
                <div className="kpi-value">{nfUSD.format(stats.usdAmount)}</div>
                <div className="kpi-label">USD Amount</div>
            </div>

            <div className="kpi-card">
                <div className="kpi-value">{nfINR.format(stats.inrAmount)}</div>
                <div className="kpi-label">INR Amount</div>
            </div>
        </div>
    );
}

export default KPIRow;