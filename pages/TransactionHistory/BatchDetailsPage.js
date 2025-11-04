import React, { useEffect, useState } from "react";
import "./BatchDetailsPageCss.css"
import printStatement from "./printStatement";
import { fetchBatchDetails,updateTransaction,deleteTransaction } from "../../services/HistoryApi";
// import Print from "./Print";

function BatchDetailsPage({ batch,onBack}){
    const [curBatch,setCurBatch] = useState(batch);
    const[error,setError]=useState("");
    const[editingRowId,setEditingRowId]=useState(null);
    const[draft,setDraft]=useState({employee:"",account:"",amount:""});

    useEffect(()=>{
        let cancelled=false;
    (async()=>{
        try{
            const fresh = await fetchBatchDetails(batch.id);
            if(!cancelled) setCurBatch(fresh);
        } catch{}
    })();
    return()=>{cancelled=true;};
    },[batch.id]);

    const canEdit=Boolean(curBatch?.canEdit || curBatch?.canDelete);

    const formattedCreateDate=batch.date ? new Date(batch.date).toLocaleDateString("en-US",{
        day: "2-digit",
        month:"short",
        year:"numeric",
    }) : "";

    const toNumberSafe=(v)=>
    typeof v === "number" ? v: Number(String(v).replace(/[^\d.-]/g,"")) || 0;
    
    const formatMoney=(val,ccy)=>{
        if(typeof val!=="number") return val ?? "";
        const locale=ccy==="INR"?"en-IN":"en-US";
        return Intl.NumberFormat(locale,{
            style:"currency",
            currency:ccy,
            maximumFractionDigits:0.
        }).format(val);
    };

    const formattedAmount=typeof curBatch?.totalAmountNum==="number"
    ? formatMoney(curBatch.totalAmountNum,curBatch.currency)
    :(curBatch?.amount || "");

    const handlePrint=()=>window.print();

    // const onEditRow=async(row)=>{
    //     try{
    //         const employeeId=row.employeeId;
    //         if(!employeeId) return alert("Cannot resolve employee id for this row");
            
    //         const newName=window.prompt("Employee name",row.employee);
    //         if(newName===null) return;

    //         const newAcc=window.prompt("Account",row.account);
    //         if(newAcc===null) return;

    //         const amtStr=window.prompt("Salary amount",String(row.amount ?? ""));
    //         if(amtStr===null) return;

    //         const amtNum=Number(String(amtStr).replace(/[^\d.-]/g,""));
    //         if(Number.isNaN(amtNum) || amtNum<0) return alert("Invalid amount");

    //         const updated=await updateTransaction(curBatch.id,employeeId,{
    //             employee:newName,
    //             account:newAcc,
    //             amount:amtNum,
    //         });
    //         setCurBatch(updated);
    //         setError("");
    //     }catch(e){
    //         setError(String(e.message || e));
    //     }
    // };

    // const onDeleteRow = async(row)=>{
    //     try{
    //         const employeeId=row.employeeId;
    //         if(!employeeId) return alert("Cannot resolve employe id for this row");
    //         if(!window.confirm("Delete this employee from batch?")) return;
    //         const updated=await deleteTransaction(curBatch.id,employeeId);
    //         setCurBatch(updated);
    //         setError("");
    //     }catch(e){
    //         setError(String(e.message || e));
    //     }
    // };
    
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

            {error ?  <div className="muted" style={{color:"#b91c9c"}}>{error}</div> : null}


            <div className="card history-details-header">
                <div className="details-title-section">
                    <div className="details-batch-id">Batch ID:{curBatch.id}</div>
                    <h3 className="details-title">{curBatch.name}</h3>
                    <div className={`status-badge status-${batch.status}`}>{batch.status.toUpperCase()}</div>
                </div>
                <div className="history-details-amount">
                    <div className="history-amount-value">{formattedAmount}</div>
                    <div className="history-amount-label">Total Amount ({curBatch.currency})</div>
                </div>
            </div>


            <div className="history-details-metrics">
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{curBatch.employees}</div>
                        <div className="history-metric-label">Employees</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{curBatch.debitAccount}</div>
                        <div className="history-metric-label">Debit Account</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{curBatch.createdBy}</div>
                        <div className="history-metric-label">Created By</div>
                    </div>
                </div>
                <div className="history-metric-card card">
                    <div className="metric-content">
                        <div className="history-metric-value">{formattedCreateDate}</div>
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
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {batch.transactions.map((t)=>(
                                <tr key={t.id}>
                                    <td>{formattedCreateDate}</td>
                                    <td>{t.id}</td>
                                    <td>{t.employee}</td>
                                    <td>{t.account}</td>
                                    <td className="ta-right">{formatMoney(Number(String(t.amount).replace(/[^\d.-]/g,""))||0,curBatch.currency)}</td>
                                    <td>
                                        <span className={`status-badge status-${t.status}`}>
                                            {t.status.toUpperCase()}
                                            </span>
                                    </td>
                                    {/* {canEdit?( */}
                                    {/* <td>
                                        <button className="history-btn btn-outline" onClick={()=>onEditRow(t)}>Edit</button>
                                        <button className="history-btn danger" style={{marginLeft:8}} onClick={()=>onDeleteRow(t)}>Delete</button>

                                    </td> */}
                                    {/* ):null} */}
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

export default BatchDetailsPage
