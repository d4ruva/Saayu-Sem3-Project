import React, { useEffect, useState } from "react";
import { fetchMobiles, fetchCompare } from "../api";

export default function Compare(){
  const [mobiles, setMobiles] = useState([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{ (async ()=>{ try{ const m = await fetchMobiles('All'); setMobiles(m); if(m && m.length>=2){ setLeft(l=> l || m[0].model); setRight(r=> r || (m[1] && m[1].model)); } }catch(e){ console.error(e); } })(); },[]);

  async function handleCompare(){
    setError(null); setResult(null);
    if(!left||!right){ setError('Select two models to compare.'); return; }
    try{
      const data = await fetchCompare(left, right);
      setResult(data);
    }catch(e){ console.error('compare error', e); setError('Compare failed.'); }
  }

  return (
    <div className="p-3">
      <h3>Compare Phones</h3>
      <div className="d-flex gap-2 mb-2">
        <select value={left} onChange={e=>setLeft(e.target.value)} className="form-select" style={{width:300}}>
          <option value="">Select left</option>
          {mobiles.map(m=> <option key={`l-${m.model}`} value={m.model}>{m.brand} {m.model}</option>)}
        </select>
        <select value={right} onChange={e=>setRight(e.target.value)} className="form-select" style={{width:300}}>
          <option value="">Select right</option>
          {mobiles.map(m=> <option key={`r-${m.model}`} value={m.model}>{m.brand} {m.model}</option>)}
        </select>
        <button className="btn btn-primary" onClick={handleCompare}>Compare</button>
      </div>

      {error && <div className="text-danger">{error}</div>}

      {result && (
        <div className="row">
          <div className="col-md-6">
            <h5>{result.phone1?.brand} {result.phone1?.model}</h5>
            <p>Price: {result.live1?.price || result.phone1?.price}</p>
            <pre style={{maxHeight:300, overflow:'auto'}}>{JSON.stringify(result.phone1, null, 2)}</pre>
          </div>
          <div className="col-md-6">
            <h5>{result.phone2?.brand} {result.phone2?.model}</h5>
            <p>Price: {result.live2?.price || result.phone2?.price}</p>
            <pre style={{maxHeight:300, overflow:'auto'}}>{JSON.stringify(result.phone2, null, 2)}</pre>
          </div>
        </div>
      )}

    </div>
  );
}
