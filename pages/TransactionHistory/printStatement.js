


function printStatement(batch) {
    const tx0 = (batch?.transactions && batch.transactions[0]) || {};
    const now = new Date();
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

    const html = `<!doctype html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Payment Transaction Details</title>
    <style>
    @page { margin: 12mm}
    body {font: 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#0f172a;}
    .sheet{max-width: 1024px;margin:0 auto; }
    .hdr{ display: flex;justify-content: space-between;align-items:flex-start;margin-bottom: 10px;gap:12px;}
.brand{font-weight:800;font-size: 20px; white-space: nowrap;}
.brand .a{color:#0473EA;margin-right: 6px;}
.brand .b{color:#82F028}
.title{font-weight: 700; letter-spacing: .3px; margin:6px 0 8px}
.meta{font-size: 12px;text-align: right;color:#334155;white-space: nowrap;}

.box{border:1px solid #cfd8e3}
.box .head{background: #eef4ff; font-weight: 700; padding: 8px 10px; border-bottom: 1px solid #cfd8e3;}
.row {display: grid; grid-template-columns: 1fr 1fr 1fr;border-bottom: 1px solid #e5e7eb;}
.cell{padding: 10px;border-right: 1px solid #e5e7eb;}

.lbl{font-size:11px;color:#475569;text-transform: uppercase;letter-spacing:.35px;margin-bottom: 4px;}
.val{font-weight: 600;}
.small{font-size: 12px; color:#334155;}
.mono{font-family: ui-monospace,Menlo,Consolas,"Courier New",monospace;}
.muted{color:#64748b}


@media (max-width:800px){
    .row{grid-template-columns: 1fr;}
    .meta{text-align: left;}
}
</style>
</head>
<body>
    <div class="sheet">
    <div class="hdr">
    <div class="title">PAYMENT BATCH SUMMARY</div>
    <div class="meta">
    <div><b>Gnerated by:</b>${batch.createdBy}</div>
    <div><b>Gnerated on : </b>${now.toLocaleString()}</div>
    </div>
    </div>

    <div class="box">
    <div class="head">PAYMENT SUMMARY</div>

    
    <div class="row">
    <div class="cell">
    <div class="lbl">Your Reference</div>
    <div class="val">${batch?.id??"-"}</div>
    </div>
    <div class="cell">
    <div class="lbl">Payment Reference</div>
    <div class="small"><b>Batch Ref.</b> <span class="val">${batch?.id??"-"}</span></div>

    </div>
    <div class="cell">
    <div class="lbl">Status</div>
    <div class="val">${String(batch?.status??"-").replace(/^./,c=>c.toUpperCase())}</div>
    </div>
    </div>


    <div class="row">
    <div class="cell">
    <div class="lbl">Payment Amount</div>
    <div class="val">${formattedAmount} </div>
    </div>
   
    <div class="cell">
    <div class="lbl">Payment Date</div>
    <div class="val">${formattedDate}</div>
    <div class="lbl">Debit Date</div>
    <div class="val">${batch?.date??"-"}</div>
    </div>
    
    </div>


    <div class="row">
    <div class="cell">
    <div class="lbl">Pay From</div>
    <div class="val mono">${batch?.debitAccount ?? "-"} ${batch?.currency??""}</div>
    </div>
    <div class="cell">
    <div class="lbl">User Name</div>
    <div class="val">${batch?.name ?? "-"}</div>
    </div>
    
    </div>


   

    <script>window.onload=()=>window.print();</script>
    </body>
    <html>`;

    const w=window.open("","_blank");
    if(!w) {alert("Please enable pop-ups to print");return;}
    w.document.open();
    w.document.write(html);
    w.document.close();

}

export default printStatement;
