import { apiFetch } from "./api";

const API_BASE = "http://localhost:8080/api";

function getAuthHeaders(){
    const token=localStorage.getItem("token");
    return token ? {Authorization : `Bearer ${token}`} : {};
}

export async function fetchBatches({q = "",status="",currency="",mine=false} = {}){
    const params=new URLSearchParams();
    if(q) params.set("q",q);
    if(status && status!=="all") params.set("status",status);
    if(currency && currency!=="all") params.set("currency",currency);
    if(mine) params.set("mine","true");
    
    // const endpoint = `/api/batches-view?${params.toString()}`;
    // const res= await apiFetch(endpoint, { method: "GET" });
    const res=await fetch(`${API_BASE}/batches-view?${params.toString()}`,
    {
        headers:{...getAuthHeaders()},
        credentials:"include",
    });
    if(!res.ok) throw new Error(`Failed to load batches: ${res.status}`);
    return res.json();
}

// export async function updateTransaction(batchId,employeeId,patch){
//     const res=await fetch(`${API_BASE}/batches-view/${batchId}/transactions/${employeeId}`,{
//         method:"PUT",
//         credentials:"include",
//         headers:{"Content-Type":"application/json",...getAuthHeaders()},
//         body:JSON.stringify(patch),
//     });
//     if(!res.ok) throw new Error(`Failed to update batches: ${res.status}`);
//     return res.json();
// }

// export async function deleteTransaction(batchId,employeeId){
//     const res=await fetch(`${API_BASE}/batches-view/${batchId}/transactions/${employeeId}`,{
//         method:"DELETE",
//         credentials:"include",
//         headers:{...getAuthHeaders()},
//     });
//     if(!res.ok) throw new Error(`Failed to Delete batches: ${res.status}`);
//     return res.json();
// }

export async function updateBatchMeta(id,payload){
    const res=await fetch(`${API_BASE}/batches-view/${id}`,{
        method:"POST",
        headers:{"Content-Type":"application/json",...getAuthHeaders()},
        // headers:getAuthHeaders,
        credentials:"include",
        body:JSON.stringify(payload),
    });
    if(!res.ok) 
    { const text=await res.text().catch(()=>"");
        throw new Error(text || `Failed to update batch: ${res.status}`);

}
    return res.json();
}

export async function deleteBatch(id){
    const res=await fetch(`${API_BASE}/batches-view/${id}`,{
        method:"DELETE",
        credentials:"include",
        headers:getAuthHeaders(),
        
    });
    if(!res.ok && res.status!==204){
        const text=await res.text().catch(()=>"");
        throw new Error(text || `Failed to Delete batch: ${res.status}`);
    } 
    return;
}

export async function fetchBankAccounts(){
    const res=await fetch(`${API_BASE}/bank-accounts`,{
        credentials:"include",
        headers:getAuthHeaders(),
    });
    if(!res.ok) throw new Error(`Failed to Load Accounts: ${res.status}`);
    return res.json();

}



export async function fetchBatchDetails(id){
    // const res=await apiFetch(`/api/batches-view/${id}`, { method: "GET" });
    const res=await fetch(`${API_BASE}/batches-view/${id}`,{
        headers:{...getAuthHeaders()},
        credentials:"include",
    });
    if(!res.ok) throw new Error(`Batch ${id} not found`);
    return res.json();
}
