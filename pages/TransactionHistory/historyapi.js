const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

export async function fetchBatches({q = "",status="",currency=""} = {}){
    const params=new URLSearchParams();
    if(q) params.set("q",q);
    if(status && status!=="all") params.set("status",status);
    if(currency && currency!=="all") params.set("currency",currency);
    const res=await fetch(`${API_BASE}/batches-view?${params.toString()}`,{
        credentials:"include",
    });
    if(!res.ok) throw new Error(`Failed to load batches: ${res.status}`);
    return res.json();
}

export async function fetchBatchDetails(id){
    const res=await fetch(`${API_BASE}/batches-view/${id}`,{credentials:"include"});
    if(!res.ok) throw new Error(`Batch ${id} not found`);
    return res.json();
}
