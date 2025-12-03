import "bootstrap/dist/css/bootstrap.min.css";


import './App.css';

import Navbar from "./Components/Navbar";
import Catalog from "./Components/Catalog";

import { useState, useEffect } from "react";

function App() {
  const [phones, setPhone] = useState([]);
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [sort, setSort] = useState("");

  const fetchPhones = () => {
    const params = [];
    if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
    if (minPrice) params.push(`min_price=${minPrice}`);
    if (maxPrice) params.push(`max_price=${maxPrice}`);
    if (ram) params.push(`ram=${ram}`);
    if (storage) params.push(`storage=${storage}`);
    if (sort) params.push(`sort=${sort}`);
    const query = params.length ? `?${params.join("&")}` : "";
    fetch(`http://localhost:8000/api/${query}`)
      .then((res) => res.json())
      .then((data) => setPhone(data))
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    fetchPhones();
    // eslint-disable-next-line
  }, [brand, minPrice, maxPrice, ram, storage, sort]);

  return (
    <div className="app-container">
      <Navbar name="Smartchoice" />
      <div
        className="filters-bar"
        style={{
          background: "#fff",
          padding: "16px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <input
          type="number"
          placeholder="RAM (GB)"
          value={ram}
          onChange={(e) => setRam(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <input
          type="number"
          placeholder="Storage (GB)"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
          className="form-control"
          style={{ width: 120 }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="form-select"
          style={{ width: 160 }}
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setBrand("");
            setMinPrice("");
            setMaxPrice("");
            setRam("");
            setStorage("");
            setSort("");
          }}
        >
          Clear Filters
        </button>
      </div>
      <div className="catalog">
        {phones.map((phone) => (
          <Catalog
            key={phone.id}
            brand={phone.brand}
            model={phone.model}
            price={phone.price}
            battery={phone.battery}
            color={phone.color}
            display={phone.display}
            ram={phone.ram}
            storage={phone.storage}
            main_camera={phone.main_camera}
            screen_size={phone.screen_size}
            sd_card={phone.sd_card}
            sim={phone.sim_card}
            self_cam={phone.self_cam}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
