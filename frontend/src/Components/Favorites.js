import React, { useEffect, useState } from "react";
import { fetchFavorites, toggleLike } from "../api";

const PLACEHOLDER = "/placeholder.png";

export default function Favorites({ onRequireAuth }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchFavorites()
      .then(data => {
        setFavorites(data || []);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        if (err?.response?.status === 401) {
          setError("You need to login to view favorites.");
        } else {
          console.error("Error fetching favorites:", err);
          setError("Failed to load favorites");
        }
        setLoading(false);
      });
  }, []);

  async function handleRemove(model) {
    const token = localStorage.getItem("sc_token");
    if (!token) {
      onRequireAuth && onRequireAuth();
      return;
    }
    try {
      await toggleLike(model);
      setFavorites(favorites.filter(m => m.model !== model));
    } catch (err) {
      if (err?.response?.status === 401) onRequireAuth && onRequireAuth();
      else {
        console.error(err);
        alert("Could not remove favorite.");
      }
    }
  }

  if (loading) return <div style={{ padding: "24px" }}>Loading favorites...</div>;
  if (error) return <div style={{ padding: "24px", color: "red" }}>{error}</div>;
  if (!favorites || favorites.length === 0) return <div style={{ padding: "24px" }}>No favorites yet.</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>Your Favorites</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
        {favorites.map(m => (
          <div key={`${m.brand}_${m.model}`} style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "4px" }}>
            <h4>{m.brand} {m.model}</h4>
            <p><strong>RAM:</strong> {m.ram} GB</p>
            <p><strong>Battery:</strong> {m.battery} mAh</p>
            <p><strong>Camera:</strong> {m.main_camera}</p>
            <p><strong>Price:</strong> ₹{m.price}</p>
            <button onClick={() => handleRemove(m.model)} className="btn btn-sm btn-danger">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
