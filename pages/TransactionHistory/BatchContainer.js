import {useState} from "react";
import BatchesPage from "./BatchesPage";
import BatchDetailsPage from "./BatchDetailsPage";
import KPIRow from "./KPIRow";
import SearchBar from "./SearchBar";
import "./SearchAndKPICss.css";

const numericAmount=(b)=>{
    const v=b.totalAmount??b.amount??b.totalAmountNum??0;
    if(typeof v==="number") return v;
    return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
};


const BATCHES=[
    {
        id : "BATCH-INR-A",
        name: "INR Payroll - BATCH A",
        amount: "₹1,20,000",
        totalAmount: "₹1,20,000",
        status: "pending",
        employees:6,
        currency: "INR",
        createdBy: "Priya Shah",
        date: "Oct 04,2025",
        debitAccount: "XXXX1234",
        description: "October Month salary",
        transactions: [
            {date:"Oct 04, 2025",id:"TXN-001",employee:"Ravi Kumar",account:"XXXX1234",amount:"₹50,000",status:"pending"},
            {date:"Oct 04, 2025",id:"TXN-002",employee:"Joel",account:"XXXX5678",amount:"₹80,000",status:"pending"}
        ]
    },
    {
        id : "BATCH-INR-B",
        name: "INR Payroll - BATCH B",
        amount: "₹1,77,000",
        totalAmount: "₹1,77,000",
        status: "pending",
        employees:5,
        currency: "INR",
        createdBy: "You",
        date: "Oct 11,2025",
        debitAccount: "XXXX7468",
        description: "November Month salary",
        transactions: [
            {date:"Oct 11, 2025",id:"TXN-001",employee:"Rahul verma",account:"XXXX1234",amount:"₹1,77,000",status:"pending"},
        ]
    },
    {
        id : "BATCH-USD-A",
        name: "USD Payroll - BATCH A",
        amount: "$5,000",
        totalAmount: "₹5,000",
        status: "approved",
        employees:3,
        currency: "USD",
        createdBy: "You",
        date: "Oct 07,2025",
        debitAccount: "XXXX4829",
        description: "December Month salary",
        transactions: [
            {date:"Oct 07, 2025",id:"TXN-001",employee:"Ravi Kumar",account:"XXXX1234",amount:"₹50,000",status:"pending"},
        ]
    },
];

function BatchesContainer(){
    const[tab,setTab]=useState("all");
    const[selected,setSelected]=useState(null);

    const[query,setQuery]=useState("");
    const[status,setStatus]=useState("all");
    const[currency,setCurrency]=useState("all");

    const allBatches=BATCHES;
    const myBatches=BATCHES.filter(b=>b.createdBy==="You");
    const baseList=tab==="all"?allBatches:myBatches;

    const q=query.trim().toLowerCase();
    const list=baseList.filter(b=>{
        const okQuery=
        !q || 
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        String(b.createdBy).toLowerCase().includes(q);

        const okStatus=status==="all" || b.status === status;
        const okCurrency=currency==="all" || b.currency === currency;
        return okQuery && okStatus && okCurrency;
    });

    const stats = {
        total:list.length,
        pending: list.filter(b=>b.status === "pending").length,
        approved: list.filter(b=>b.status === "approved").length,
        usdAmount: list.filter(b=>b.currency === "USD").reduce((s,b) => s+numericAmount(b),0),
        inrAmount: list.filter(b=>b.currency === "INR").reduce((s,b) => s+numericAmount(b),0),
        employees: list.reduce((s,b) => s+Number(b.employees || 0),0),

    };


    if(selected){
        return <BatchDetailsPage batch={selected} onBack={()=>setSelected(null)}/>
    }

    
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
                    showActions={tab==="mine" && b.status!=="approved"}
                    onView={()=>setSelected(b)}
                    />
                ))}
            </div>
        </section>
    );
}

export default BatchesContainer;