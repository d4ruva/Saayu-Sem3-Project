import React, { useEffect, useState } from "react";
import { fetchMobiles, toggleLike } from "../api";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23e0e0e0' width='160' height='160'/%3E%3Ctext x='50%' y='50%' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
const PAGE_SIZE = 12;

export default function Catalog({ onRequireAuth }) {
  const [mobiles, setMobiles] = useState([]);
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState(null);
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const brands = mobiles.length > 0 ? Array.from(new Set(mobiles.map(m => m.brand).filter(Boolean))) : [];

  useEffect(() => {
    setLoading(true);
    setPage(0);

    fetchMobiles(brand, sort, order)
      .then(data => {
        setMobiles(data || []);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching mobiles:", err);
        setError("Failed to load phones");
        setLoading(false);
      });
  }, [brand, sort, order]);

  async function handleLike(model) {
    const token = localStorage.getItem("sc_token");
    if (!token) {
      onRequireAuth && onRequireAuth();
      return;
    }
    try {
      await toggleLike(model);
    } catch (e) {
      console.error("toggleLike error", e);
      if (e?.response?.status === 401) onRequireAuth && onRequireAuth();
      else alert("Could not toggle favorite.");
    }
  }

  const total = mobiles.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = mobiles.filter(phone => 
    (phone.brand.toLowerCase().includes(search.toLowerCase()) || 
     phone.model.toLowerCase().includes(search.toLowerCase()))
  );
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "16px" }}>SmartChoice Catalog</h2>
        <div style={{
          position: "relative",
          marginBottom: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <input
            type="text"
            placeholder="🔍 Search by brand or model..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              fontSize: "16px",
              outline: "none",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "inset 0 0 0 2px #0d6efd";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(0); }}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "24px", gap: "8px" }}>
        <select value={brand} onChange={e => setBrand(e.target.value)} className="form-select" style={{ width: 150 }}>
          <option>All</option>
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={sort || ""} onChange={e => setSort(e.target.value || null)} className="form-select" style={{ width: 150 }}>
          <option value="">Sort: Default</option>
          <option value="ram">RAM</option>
          <option value="battery">Battery</option>
          <option value="price">Price</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value)} className="form-select" style={{ width: 100 }}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "4px", backgroundColor: "#f5f5f5" }}>
              <div style={{ height: "200px", backgroundColor: "#e0e0e0", marginBottom: "12px" }} />
              <div style={{ height: "16px", backgroundColor: "#e0e0e0", marginBottom: "8px" }} />
              <div style={{ height: "12px", backgroundColor: "#e0e0e0" }} />
            </div>
          ))
        ) : visible.length === 0 ? (
          <div>No phones found.</div>
        ) : (
          visible.map((phone, idx) => (
            <div key={`${phone.brand}_${phone.model}_${idx}`} style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "4px", display: "flex", flexDirection: "column" }}>
              <img
                src={PLACEHOLDER}
                alt={phone.model}
                width={160}
                height={160}
                style={{ borderRadius: "4px", marginBottom: "12px", objectFit: "cover" }}
                onError={e => { e.currentTarget.src = PLACEHOLDER; }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                <h4 style={{ margin: 0 }}>{phone.brand} {phone.model}</h4>
                <button onClick={() => handleLike(phone.model)} style={{ backgroundColor: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}>♡</button>
              </div>
              <p style={{ fontSize: "14px", color: "#666", margin: "4px 0" }}>Processor: {phone.processor || "N/A"}</p>
              <p style={{ fontSize: "14px", margin: "4px 0" }}>RAM: {phone.ram || "N/A"} GB • Battery: {phone.battery || "N/A"} mAh</p>
              <p style={{ fontSize: "14px", margin: "4px 0" }}>Camera: {phone.main_camera || "N/A"}</p>
              <p style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>₹{phone.price || "N/A"}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>Showing {Math.min(filtered.length, (page + 1) * PAGE_SIZE)} of {filtered.length}</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-sm btn-outline-primary" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>Prev</button>
          <div style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px" }}>{page + 1} / {pages}</div>
          <button className="btn btn-sm btn-outline-primary" disabled={page >= pages - 1} onClick={() => setPage(Math.min(page + 1, pages - 1))}>Next</button>
        </div>
      </div>
    </div>
  );
}
