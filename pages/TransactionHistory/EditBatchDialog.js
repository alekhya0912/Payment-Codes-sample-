import react,{useEffect,useState} from "react";
import { fetchBankAccounts,updateBatchMeta } from "../../services/HistoryApi";

export default function EditBatchDialog({open,onClose,batch,onSaved}){
    const [name,setName]=useState(batch?.name || "");
    const[debit,setDebit]=useState(batch?.debitAccount || "");
    const[currency,setCurrency]=useState(batch?.currency || "INR");
    const[accounts,setAccounts]=useState([]);
    const[saving,setSaving]=useState(false);
    const[error,setError]=useState("");

    useEffect(()=>{
        if(!open) return;
        setName(batch?.name || "");
        setDebit(batch?.debitAccount || "");
        setCurrency(batch?.currency || "INR")
        setError("");
        (async ()=>{
            try{
                const acc=await fetchBankAccounts();
                setAccounts(acc);
            }catch(e){
                setAccounts([]);
                setError(String(e.message || e));
            }
        })();
    },[open,batch]);

    if(!open) return null;

    const onSave=async()=>{
        try{
            setSaving(true);
            setError("");
            const updated=await updateBatchMeta(batch.id,{
                name,
                debitAccount:debit,
                currency,
            });

            onSaved && onSaved(updated);
            onClose();
        } catch(e){
            setError(String(e.message || e));
        }
        finally{
            setSaving(false);
        }
    };

    return(
        <div className="simple-modal-backdrop">
                <div className="simple-modal">
                    <h4>Edit Batch</h4>
                    {error ? <div className="error-text">{error}</div> : null}

                    <div className="form-row">
                        <label>Batch Name</label>
                        <input value={name} onChange={(e)=>setName(e.target.value)}/>
                    </div>
                    
                    <div className="form-row">
                        <label>Debit Account</label>
                        <select value={debit} onChange={(e)=>setDebit(e.target.value)}>
                        <option value="">Select account</option>
                        {accounts.map(a=>(
                            <option key={a.id} value={a.accountNumber}>
                                {a.accountNumber}
                            </option>
                        ))}
                        </select>
                    </div>
                    
                    <div className="form-row">
                        <label>Currency</label>
                        <select value={currency} onChange={(e)=>setCurrency(e.target.value)}>
                            <option value="">Select</option>
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                        </select>
                        </div>
                     <div className="modal-actions">
                        <button className="history-btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
                        <button className="history-btn btn-outline" disabled={saving} onClick={onSave}>Save</button>
                     </div>
                    </div>
                    
                </div>
                
    );
}
