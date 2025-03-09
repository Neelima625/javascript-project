document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('candyDetails');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
  
    cart.forEach(candy => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <img src="${candy.image}" alt="${candy.name}" class="cart-image">
            <h3>${candy.name}</h3>
            <p>Flavour: ${candy.flavour}</p>
            <p>Brand: ${candy.brand}</p>
            <p>Price: ${candy.price}&#8377;</p>
            <p>Quantity: ${candy.quantity}</p>
            <button class="remove-btn" data-name="${candy.name}">Remove</button>
        `;
  
        cartContainer.appendChild(itemDiv);
    });
  
    // Remove Item from Cart
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const nameToRemove = event.target.dataset.name;
            cart = cart.filter(item => item.name !== nameToRemove);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    });
  });
  