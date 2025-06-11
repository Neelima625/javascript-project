document.addEventListener('DOMContentLoaded', () => {
  const candyDetailsDiv = document.getElementById('candyDetails');
  const selectedCandy = JSON.parse(localStorage.getItem('selectedCandy'));

  if (selectedCandy) {
      candyDetailsDiv.innerHTML = `
          <div class="card"><div>
              <img src="${selectedCandy.image}" class="card-img-top" alt="${selectedCandy.name}">
              
              </div>
              <div class="card-body">
               <h2 class="name">${selectedCandy.name}</h2>
                  <div class="line-1">
                 <span class="card-text">Flavour: ${Array.isArray(selectedCandy.flavour) ? selectedCandy.flavour.join(', ') : selectedCandy.flavour}  &nbsp|&nbsp Price: ${selectedCandy.price}&#8377;
                 </span>
            </div>
            <div >
                <span class="card-text">Brand: ${selectedCandy.brand}  &nbsp|&nbsp Rating:<button class=" rating fa fa-star checked"> ${selectedCandy.rating}</button></span>
            </div>
                 <div class="shop-btns">
                      <button id="addToCart">Add to Cart</button>
                      
                  </div>
              </div>
          </div>
      `;

      // Add to Cart Button Functionality
      document.getElementById('addToCart').addEventListener('click', () => {
          let cart = JSON.parse(localStorage.getItem('cart')) || [];

          // Check if item already exists in the cart
          let existingItem = cart.find(item => item.name === selectedCandy.name);
          if (existingItem) {
              existingItem.quantity += 1; // Increase quantity
          } else {
              selectedCandy.quantity = 1; // Set initial quantity
              cart.push(selectedCandy);
          }

          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Added to cart!');
      });

      
  } else {
      candyDetailsDiv.innerHTML = "<p>No candy details found.</p>";
  }
});
