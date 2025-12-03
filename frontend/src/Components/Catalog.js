function Catalog({
  brand, model, price, battery, color, display,
  ram, storage, main_camera, screen_size,
  sd_card, sim, self_cam
}) {
  return (

// <div class="card" style={{width: "18rem"}}>
//   <img src="..." class="card-img-top" alt="..."/>
//   <div class="card-body">
//     <h5 class="card-title">{brand} - {model}</h5>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
//     <a href="https://www.google.com" class="btn btn-primary">Go somewhere</a>
//   </div>
// </div>

<div className="catalog-card card">
  <img
    src="https://via.placeholder.com/250x180?text=Mobile+Image"
    className="card-img-top product-image"
    alt={brand + ' ' + model}
  />
  <div className="card-body">
    <h5 className="card-title">{brand} {model}</h5>
    <p className="card-text price">₹{price}</p>
    <ul className="list-group list-group-flush product-details">
      <li className="list-group-item">Storage: {storage} GB</li>
      <li className="list-group-item">RAM: {ram} GB</li>
      <li className="list-group-item">Battery: {battery} mAh</li>
      <li className="list-group-item">Display: {display}</li>
      <li className="list-group-item">Color: {color}</li>
      <li className="list-group-item">Main Camera: {main_camera}</li>
      <li className="list-group-item">Selfie Camera: {self_cam} MP</li>
      <li className="list-group-item">Screen Size: {screen_size}"</li>
      <li className="list-group-item">SD Card: {sd_card ? "Yes" : "No"}</li>
      <li className="list-group-item">SIM: {sim}</li>
    </ul>
    <button className="btn btn-primary btn-block mt-3">Add to Cart</button>
  </div>
</div>

/*{ 
    <div className="catalog-card">
      <h2>{brand} {model}</h2>
      <p>Price: ₹{price}</p>
      <p>Battery: {battery} mAh</p>
      <p>Color: {color}</p>
      <p>Display: {display}</p>
      <p>RAM: {ram} GB</p>
      <p>Storage: {storage} GB</p>
      <p>Main Camera: {main_camera}</p>
      <p>Selfie Camera: {self_cam} MP</p>
      <p>Screen Size: {screen_size}</p>
      <p>SD Card: {sd_card ? "Yes" : "No"}</p>
      <p>SIM: {sim}</p>
    </div> }*/
  );
}

export default Catalog;

