document.addEventListener('DOMContentLoaded', () => {
    const candyDetailsDiv = document.getElementById('candyDetails');
    const selectedCandy = JSON.parse(localStorage.getItem('selectedCandy'));

    if (selectedCandy) {
        candyDetailsDiv.innerHTML = `
            <div class="card">
            <img src="${selectedCandy.image}" class="card-img-top" alt="${selectedCandy.name}">
            <div class="card-body">
              <h5 class="card-title">${selectedCandy.name}</h5>
              <p class="card-text">Flavour: ${Array.isArray(selectedCandy.flavour) ? selectedCandy.flavour.join(', ') : selectedCandy.flavour}</p>
              <p class="card-text">Brand: ${selectedCandy.brand}</p>
              <p class="card-text">Price: ${selectedCandy.price}&#8377;</p>
              <p class="card-text">Rating: ${selectedCandy.rating}</p>
              <div>
              <button>add to cart</button>
              <button>buy now</button>
              </div>
            </div>
          </div>
        `;
    } else {
        candyDetailsDiv.innerHTML = "<p>No candy details found.</p>";
    }
});