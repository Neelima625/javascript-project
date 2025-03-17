document.addEventListener('DOMContentLoaded', () => {
  const candyDetailsDiv = document.getElementById('candyDetails');
  const selectedCandy = JSON.parse(localStorage.getItem('selectedCandy'));

  if (selectedCandy) {
      candyDetailsDiv.innerHTML = `
          <div class="card"><div>
              <img src="${selectedCandy.image}" class="card-img-top" alt="${selectedCandy.name}">
                <div class="shop-btns">
                      <button id="addToCart">Add to Cart</button>
                      <button id="buyNow">Buy Now</button>
                  </div>
              </div>
              <div class="card-body">
                  <h2 class="card-title">${selectedCandy.name}</h2>
                  <p class="card-text">Flavour: ${Array.isArray(selectedCandy.flavour) ? selectedCandy.flavour.join(', ') : selectedCandy.flavour}</p>
                  <p class="card-text">Brand: ${selectedCandy.brand}</p>
                  <p class="card-text">Price: ${selectedCandy.price}&#8377;</p>
                  <p class="card-text">Rating:<button><span class="fa fa-star checked"></span> ${selectedCandy.rating}</button></p>
                
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

      // Buy Now Button (Redirect to Cart Page)
      // document.getElementById('buyNow').addEventListener('click', () => {
      //     window.location.href = 'cart.html'; // Change to your cart page
      // });
  } else {
      candyDetailsDiv.innerHTML = "<p>No candy details found.</p>";
  }
});
