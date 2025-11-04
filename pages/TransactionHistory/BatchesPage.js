import React, { useState } from "react";
import "./BatchesPageCss.css"
import { updateBatchMeta,deleteBatch } from "../../services/HistoryApi";


function BatchesPage({ batch, onView, showActions,onEdit,onDelete }) {

    // const formattedAccount = typeof batch.totalAmountNum==="number"?
    // new Intl.NumberFormat(batch.currency === "INR" ? "en-IN" : "en-US",
    // {style:"currency",currency:batch.currency}).format(batch.totalAmountNum):batch.amount;'

    const statusRaw = batch.status??batch.paymentStatus ?? "";
    const statusKey=statusRaw.toLowerCase();
    const statusText = statusRaw.toUpperCase();

    // const[open,setOpen]=useState(false);
    // const[debitAccount,setDebitAccount]=useState(batch.debitAccount || "");
    // const[currency,setCurrency]=useState(batch.currency || "");
    // const[saving,setSaving]=useState(false);
    // const[error,setError]=useState("");

    // const openEdit=()=>{
    //     setDebitAccount(batch.debitAccount || "");
    //     setCurrency(batch.currency || "");
    //     setError("");
    //     setOpen(true);
    // };

    // const saveEdit=async()=>{
    //     try{
    //         setSaving(true);
    //         const updated=await updateBatchMeta(batch.id,{debitAccount,currency});
    //         setSaving(false);
    //         setOpen(false);
    //         setError("");
    //         onCardChanged && onCardChanged(updated);
    //     } catch(e){
    //         setSaving(false);
    //         setError(String(e.message || e));
    //     }
    // };

    // const doDelete=async()=>{
    //     try{
    //         setSaving(true);
    //         await deleteBatch(batch.id);
    //         setSaving(false);
    //         setOpen(false);
    //         setError("");
    //         onCardDeleted && onCardDeleted(batch.id);
    //     } catch(e){
    //         setSaving(false);
    //         setError(String(e.message || e));
    //     }
    // }


    const formatMoney=(val,ccy)=>{
        if(typeof val!="number") return val ?? "";
        if(ccy === "INR"){
            return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(val);
        }
        if(ccy === "USD"){
            return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(val);
        }
        return val.toLocaleString();
    };

    const formattedAmount=typeof batch.totalAmountNum==="number"
    ? formatMoney(batch.totalAmountNum,batch.currency)
    :(batch.amount || "");

    const formattedDate=batch.date ? new Date(batch?.date).toLocaleDateString("en-US",{
        day: "2-digit",
        month:"short",
        year:"numeric",
    }) : "";
    const formattedAccount = (()=>{
        if(typeof batch.totalAmountNum==="number"){
            if(batch.currency === "INR" || batch.currency ==="USD"){
                return new Intl.NumberFormat(
                    batch.currency === "INR"?"en-IN":"en-US",
                    {style:"currency",currency:batch.currency}
                ).format(batch.totalAmountNum);
            }
            return batch.totalAmountNum.toLocaleString();
        }
        return batch.amount || "";
    })();
 

    const canEditDelete = showActions && batch.status !== "approved";
    return (
        <div className="batches-container">
        <article className="card batch-card">
            <div className="batch-card-header">
                <div className="batch-card-title">
                    <div className="history-batch-id">ID: {batch.id}</div>
                    <h3>{batch.name}</h3>
                    <div className={`status-badge status-${statusKey}`}>
                        {statusText}
                    </div>
                </div>
                <div className="batch-card-amount">{formattedAmount}</div>
            </div>

        <div className="batch-card-body">
            <div className="batch-detail"><span className="history-detail-label">Employees</span><span className="history-detail-value>">{batch.employees}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Currency</span><span className="history-detail-value>">{batch.currency}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Created By</span><span className="history-detail-value>">{batch.createdBy}</span></div>
            <div className="batch-detail"><span className="history-detail-label">Date</span><span className="history-detail-value>">{formattedDate}</span></div>
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
            
            {showActions
             && (
                    <>
                    <button className="history-btn ghost" onClick={onEdit}>Edit</button>
                    <button className="history-btn danger" onClick={onDelete} >Delete</button>
                    </>
                )}
        </div>
        </article>

        {/* {open && (
            <div className="simple-modal-backdrop">
                <div className="simple-modal">
                    <h4>Edit Batch</h4>
                    {error ? <div className="error-text">{error}</div> : null}
                    
                    <div className="form-row">
                        <label>Debit Account</label>
                        <input value={debitAccount} onChange={(e)=>setDebitAccount(e.target.value)}/>
                    </div>
                    
                    <div className="form-row">
                        <select value={currency} onChange={(e)=>setCurrency(e.target.value)}>
                            <option value="">Select</option>
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                     <div className="modal-actions">
                        <button className="history-btn btn-outline" disabled={saving} onClick={()=>setOpen(false)}>Cancel</button>
                        <button className="history-btn btn-outline" disabled={saving} onClick={saveEdit}>Save</button>
                     </div>
                    </div>
                    
                </div>
                </div>
        )} */}
        </div>
    );
}

export default BatchesPage;
