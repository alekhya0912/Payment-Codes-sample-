import react,{useEffect,useState,useMemo} from "react";
import BatchesPage from "./BatchesPage";
import BatchDetailsPage from "./BatchDetailsPage";
import KPIRow from "./KPIRow";
import SearchBar from "./SearchBar";
import "./SearchAndKPICss.css";
import { fetchBatches,fetchBatchDetails } from "../../services/HistoryApi";
import EditBatchDialog from "./EditBatchDialog";
import { deleteBatch } from "../../services/HistoryApi";

const numericAmount=(b)=>{
    const v=b.totalAmount??b.amount??b.totalAmountNum??0;
    if(typeof v==="number") return v;
    return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
};


// const BATCHES=[
//     {
//         id : "BATCH-INR-A",
//         name: "INR Payroll - BATCH A",
//         amount: "₹1,20,000",
//         totalAmount: "₹1,20,000",
//         status: "pending",
//         employees:6,
//         currency: "INR",
//         createdBy: "Priya Shah",
//         date: "Oct 04,2025",
//         debitAccount: "XXXX1234",
//         description: "October Month salary",
//         transactions: [
//             {date:"Oct 04, 2025",id:"TXN-001",employee:"Ravi Kumar",account:"XXXX1234",amount:"₹50,000",status:"pending"},
//             {date:"Oct 04, 2025",id:"TXN-002",employee:"Joel",account:"XXXX5678",amount:"₹80,000",status:"pending"}
//         ]
//     },
//     {
//         id : "BATCH-INR-B",
//         name: "INR Payroll - BATCH B",
//         amount: "₹1,77,000",
//         totalAmount: "₹1,77,000",
//         status: "pending",
//         employees:5,
//         currency: "INR",
//         createdBy: "You",
//         date: "Oct 11,2025",
//         debitAccount: "XXXX7468",
//         description: "November Month salary",
//         transactions: [
//             {date:"Oct 11, 2025",id:"TXN-001",employee:"Rahul verma",account:"XXXX1234",amount:"₹1,77,000",status:"pending"},
//         ]
//     },
//     {
//         id : "BATCH-USD-A",
//         name: "USD Payroll - BATCH A",
//         amount: "$5,000",
//         totalAmount: "₹5,000",
//         status: "approved",
//         employees:3,
//         currency: "USD",
//         createdBy: "You",
//         date: "Oct 07,2025",
//         debitAccount: "XXXX4829",
//         description: "December Month salary",
//         transactions: [
//             {date:"Oct 07, 2025",id:"TXN-001",employee:"Ravi Kumar",account:"XXXX1234",amount:"₹50,000",status:"pending"},
//         ]
//     },
// ];



function BatchesContainer(){
    const [editOpen,setEditOpen]=useState(false);
const [editing,setEditing]=useState(null);


const refresh=async()=>{
    try{
        const data=await fetchBatches({q:query,status,mine:tab==="mine"?"true":""});
        setServerBatches(Array.isArray(data)?data:[]);
    } catch(e){
        setError(String(e.message || e));
    }
};

const onEdit=(b)=>{
    setEditing(b);
    setEditOpen(true);
};

const onDelete=async(b)=>{
    try{
        await deleteBatch(b.id);
        refresh();
    }
    catch(e){
        setError(String(e.message || e));
    }
};
    const[tab,setTab]=useState("all");
    const[selected,setSelected]=useState(null);
    const[loading,setLoading]=useState(false);
    const[error,setError] = useState("");

    const[query,setQuery]=useState("");
    const[status,setStatus]=useState("all");
    const[currency,setCurrency]=useState("all");

    const[serverBatches,setServerBatches]=useState([]);

    useEffect(()=>{
        let cancelled = false;
        (async()=>{
            try {
                setLoading(true); 
                setError("");
                const data = await fetchBatches({
                   q:query,status,mine:tab==="mine",
                });
                if(!cancelled) setServerBatches(Array.isArray(data)?data:[]);
            } catch(e) {
                if(!cancelled) setError(String(e.message || e));
            } finally{
                if(!cancelled) setLoading(false);
            }
        })();
        return ()=>{cancelled=true;};
    }, [query,status,tab]);

    // const allBatches=BATCHES;
    // const myBatches=BATCHES.filter(b=>b.createdBy==="You");
    // const baseList=tab==="all"?allBatches:myBatches;
    const baseList=serverBatches;

    const list=useMemo(()=>{
        return baseList.filter(b=>currency === "all" || b.currency === currency);
    },[baseList,currency]);

    // const q=query.trim().toLowerCase();
    // const list=baseList.filter(b=>{
    //     const okQuery=
    //     !q || 
    //     b.id.toLowerCase().includes(q) ||
    //     b.name.toLowerCase().includes(q) ||
    //     String(b.createdBy).toLowerCase().includes(q);

    //     const okStatus=status==="all" || b.status === status;
    //     const okCurrency=currency==="all" || b.currency === currency;
    //     return okQuery && okStatus && okCurrency;
    // });

    // const stats = {
    //     total:list.length,
    //     pending: list.filter(b=>b.status === "pending").length,
    //     approved: list.filter(b=>b.status === "approved").length,
    //     usdAmount: list.filter(b=>b.currency === "USD").reduce((s,b) => s+numericAmount(b),0),
    //     inrAmount: list.filter(b=>b.currency === "INR").reduce((s,b) => s+numericAmount(b),0),
    //     employees: list.reduce((s,b) => s+Number(b.employees || 0),0),

    // };

    const stats = useMemo(() => ({
        total : list.length,
        pending : list.filter(b=>b.status === "pending").length,
        approved: list.filter(b=>b.status === "approved").length,
        rejected: list.filter(b=>b.status === "rejected").length,
        usdAmount: list.filter(b=>b.currency === "USD").reduce((s,b) => s+numericAmount(b),0),
        inrAmount: list.filter(b=>b.currency === "INR").reduce((s,b) => s+numericAmount(b),0),
        employees: list.reduce((s,b) => s+Number(b.employees || 0),0),
    }),[list]);

    const handleView = async(batch)=>{
        try{
            setLoading(true);
            const details=await fetchBatchDetails(batch.id);
            setSelected(details);
        } catch(e){
            setError(String(e.message || e));
        }finally{
            setLoading(false);
        }
    };


    if(selected){
        return <BatchDetailsPage batch={selected} onBack={()=>setSelected(null)}/>
    }

    const handleCardChanged=(updatedCard)=>{
        setServerBatches(prev=>prev.map(b=>b.id===updatedCard.id ? {...b,...updatedCard}:b));
    };

    const handleCardDeleted=(id)=>{
        setServerBatches(prev=>prev.filter(b=>b.id!==id));
    };



    
    return(
        <section>
            <header className="history-page-header">
                <h1 className="history-page-title">Transaction History</h1>
                <p className="history-page-subtitle">View All Payroll Batches or Manage Your Own</p>
            </header>

            <KPIRow stats={stats}/>

            <SearchBar
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            currency={currency}
            onCurrency={setCurrency}
            resultCount={list.length}
            onClear={() => setQuery(" ")}
            />

            <div 
            style={{display:"flex",gap:8,marginBottom: 16, marginLeft: 40, marginTop:20}}
            >
                <button
                    className={`tab-btn ${tab==="all"?"active":""}`}
                    onClick={()=>setTab("all")}
                    >
                    All Batches
                </button>
                <button
                className={`tab-btn ${tab==="mine"?"active":""}`}
                onClick={()=>setTab("mine")}
                >
                    My Batches
                </button>
            </div>

            <div className="batches-grid">
                {list.map(b=>(
                    <BatchesPage
                    key={b.id}
                    batch={b}
                    showActions={tab==="mine" && Boolean(b.canEdit || b.canDelete)}
                    onView={()=>handleView(b)}
                    onEdit={()=>onEdit(b)}
                    onDelete={()=>onDelete(b)}
                    />
                ))}
            </div>

            <EditBatchDialog
            open={editOpen}
            onClose={()=>setEditOpen(false)}
            batch={editing}
            onSaved={()=>refresh()}
            />
            </section>
    );
}

export default BatchesContainer;
