import React from "react";
import "./SearchAndKPICss.css";

function SearchBar({
    query,onQuery,
    status,onStatus,
    currency,onCurrency,
    resultCount,onClear
}) {
    return(
        <div className="search-row card">
            <div className="search-left">
                <div className="search-input-wrap">
                    <input 
                    className="history-search-input"
                    placeholder="Search by ID,name, or creator"
                    value={query}
                    onChange={(e)=>onQuery(e.target.value)}
                    />
                    {query && (
                        <button className="search-clear" on onClick={onClear}></button>
                    )}
                </div>

                <select className="search-select" value={status} onChange={(e)=>onStatus(e.target.value)}>
                    <option value="all">Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

     

                <select className="search-select" value={currency} onChange={(e)=>onCurrency(e.target.value)}>
                    <option value="all">Currency: All</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                </select>
            </div>
            <div className="search-meta">
                Showing <strong>{resultCount}</strong> result{resultCount !==1 ?"s" : ""}
            </div>
        </div>
    );
}

export default SearchBar;