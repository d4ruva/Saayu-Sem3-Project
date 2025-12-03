import React, { useEffect, useState } from "react";
import { fetchPreferences, toggleLike } from "../api";

const TYPES = ["gaming", "battery", "photography", "performance"];
const PLACEHOLDER = "/placeholder.png";

export default function Preferences({ onRequireAuth }) {
  const [type, setType] = useState("gaming");
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchPreferences(type)
      .then(data => {
        setMobiles(data || []);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching preferences:", err);
        setError("Failed to load recommendations");
        setLoading(false);
      });
  }, [type]);

  async function handleLike(model) {
    const token = localStorage.getItem("sc_token");
    if (!token) {
      onRequireAuth && onRequireAuth();
      return;
    }
    try {
      await toggleLike(model);
      // Optionally refresh favorites query
    } catch (e) {
      console.error("toggleLike error:", e);
      if (e?.response?.status === 401) onRequireAuth && onRequireAuth();
      else alert("Could not toggle favorite.");
    }
  }

  if (loading) return <div style={{ padding: "24px" }}>Loading recommendations...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  if (!mobiles || mobiles.length === 0) return <div style={{ padding: "24px" }}>No recommendations found.</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Preferences</h2>
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`btn ${t === type ? "btn-primary" : "btn-outline-primary"}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
        {mobiles.map(m => (
          <div key={`${m.brand}_${m.model}`} style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "4px" }}>
            <h4>{m.brand} {m.model}</h4>
            <p><strong>RAM:</strong> {m.ram} GB</p>
            <p><strong>Battery:</strong> {m.battery} mAh</p>
            <p><strong>Camera:</strong> {m.main_camera}</p>
            <p><strong>Price:</strong> ₹{m.price}</p>
            <button onClick={() => handleLike(m.model)} className="btn btn-sm btn-outline-danger">♡ Add to Favorites</button>
          </div>
        ))}
      </div>
    </div>
  );
}
