// document.addEventListener('DOMContentLoaded', () => {
//     const cartContainer = document.getElementById('candyDetails');
//     const totalContainer = document.createElement('div');
//     totalContainer.id = 'totalContainer';
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

//     function updateCartUI() {
//         cartContainer.innerHTML = '';

//         if (cart.length === 0) {
//             cartContainer.innerHTML = "<p>Your cart is empty.</p>";
//             totalContainer.innerHTML = '';
//             return;
//         }

//         let totalPrice = 0;
//         let totalQuantity = 0;

//         cart.forEach((candy, index) => {
//             totalPrice += candy.price * candy.quantity;
//             totalQuantity += candy.quantity;

//             const itemDiv = document.createElement('div');
//             itemDiv.classList.add('cart-item');
//             itemDiv.innerHTML = `
//                 <img src="${candy.image}" alt="${candy.name}" class="cart-image">
//                 <h3>${candy.name}</h3>
//                 <p>Flavour: ${candy.flavour}</p>
//                 <p>Brand: ${candy.brand}</p>
//                 <p>Price: ${candy.price}&#8377;</p>
//                 <p>Quantity: 
//                     <button class="decrease" data-name="${candy.name}">-</button> 
//                     <span>${candy.quantity}</span> 
//                     <button class="increase" data-name="${candy.name}">+</button>
//                 </p>
//                 <button class="remove-btn" data-name="${candy.name}">Remove</button>
//                 <button class="wishlist-btn" data-name="${candy.name}">Move to Wishlist</button>
//             `;

//             cartContainer.appendChild(itemDiv);
//         });

//         // Update total price and quantity
//         totalContainer.innerHTML = `
//             <h3>Total Price: ${totalPrice}&#8377;</h3>
//             <h3>Total Quantity: ${totalQuantity}</h3>
//         `;
//         cartContainer.appendChild(totalContainer);

//         attachEventListeners();
//     }

//     function attachEventListeners() {
//         document.querySelectorAll('.remove-btn').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 const nameToRemove = event.target.dataset.name;
//                 cart = cart.filter(item => item.name !== nameToRemove);
//                 localStorage.setItem('cart', JSON.stringify(cart));
//                 updateCartUI();
//             });
//         });

//         document.querySelectorAll('.increase').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 const name = event.target.dataset.name;
//                 const item = cart.find(candy => candy.name === name);
//                 if (item) {
//                     item.quantity++;
//                     localStorage.setItem('cart', JSON.stringify(cart));
//                     updateCartUI();
//                 }
//             });
//         });

//         document.querySelectorAll('.decrease').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 const name = event.target.dataset.name;
//                 const item = cart.find(candy => candy.name === name);
//                 if (item && item.quantity > 1) {
//                     item.quantity--;
//                 } else {
//                     cart = cart.filter(candy => candy.name !== name);
//                 }
//                 localStorage.setItem('cart', JSON.stringify(cart));
//                 updateCartUI();
//             });
//         });

//         document.querySelectorAll('.wishlist-btn').forEach(button => {
//             button.addEventListener('click', (event) => {
//                 const name = event.target.dataset.name;
//                 moveToWishlist(name);
//             });
//         });
//     }

//     function moveToWishlist(name) {
//         const itemIndex = cart.findIndex(candy => candy.name === name);
//         if (itemIndex !== -1) {
//             const item = cart[itemIndex];

//             let wishlistItem = wishlist.find(candy => candy.name === item.name);
//             if (!wishlistItem) {
//                 wishlist.push(item);
//             }

//             cart.splice(itemIndex, 1);
//             localStorage.setItem('cart', JSON.stringify(cart));
//             localStorage.setItem('wishlist', JSON.stringify(wishlist));
//             updateCartUI();
//         }
//     }

//     // Initial UI rendering
//     updateCartUI();
// });

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('candyDetails');
    const totalContainer = document.createElement('div');
    totalContainer.id = 'totalContainer';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function updateCartUI() {
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalContainer.innerHTML = '';
            return;
        }

        let totalPrice = 0;
        let totalQuantity = 0;

        // Create table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Table header
        const headerRow = table.insertRow();
        const headers = ['Details', 'Price', 'Quantity', 'Actions'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.border = '1px solid #ddd';
            header.style.padding = '8px';
            header.style.textAlign = 'left';
            headerRow.appendChild(header);
        });

        cart.forEach((candy, index) => {
            totalPrice += candy.price * candy.quantity;
            totalQuantity += candy.quantity;

            const row = table.insertRow();
            row.style.border = '1px solid #ddd';

            const detailsCell = row.insertCell();
            const priceCell = row.insertCell();
            const quantityCell = row.insertCell();
            const actionsCell = row.insertCell();

            detailsCell.innerHTML = `
                <img src="${candy.image}" alt="${candy.name}" style="max-width: 50px; height: auto; vertical-align: middle; margin-right: 10px;">
                <span>${candy.name}</span>
            `;
            priceCell.textContent = `${candy.price}₹`;

            quantityCell.innerHTML = `
                <button class="decrease" data-name="${candy.name}">-</button> 
                <span>${candy.quantity}</span> 
                <button class="increase" data-name="${candy.name}">+</button>
            `;

            actionsCell.innerHTML = `
                <button class="remove-btn" data-name="${candy.name}">Remove</button>
                <button class="wishlist-btn" data-name="${candy.name}">Wishlist</button>
            `;
        });

        cartContainer.appendChild(table);

        // Update total price and quantity
        totalContainer.innerHTML = `
            <h3>Total Price: ${totalPrice}₹</h3>
            <h3>Total Quantity: ${totalQuantity}</h3>
        `;
        cartContainer.appendChild(totalContainer);

        attachEventListeners();
    }

   
    function attachEventListeners() {
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const nameToRemove = event.target.dataset.name;
                cart = cart.filter(item => item.name !== nameToRemove);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            });
        });

        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.target.dataset.name;
                const item = cart.find(candy => candy.name === name);
                if (item) {
                    item.quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                }
            });
        });

        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.target.dataset.name;
                const item = cart.find(candy => candy.name === name);
                if (item && item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(candy => candy.name !== name);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            });
        });

        document.querySelectorAll('.wishlist-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.target.dataset.name;
                moveToWishlist(name);
            });
        });
    }

    function moveToWishlist(name) {
        const itemIndex = cart.findIndex(candy => candy.name === name);
        if (itemIndex !== -1) {
            const item = cart[itemIndex];

            let wishlistItem = wishlist.find(candy => candy.name === item.name);
            if (!wishlistItem) {
                wishlist.push(item);
            }

            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateCartUI();
        }
    }

    updateCartUI();
});