document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderWishlist() {
        wishlistContainer.innerHTML = '';

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
            return;
        }

        wishlist.forEach((candy, index) => {
            const candyDiv = document.createElement('div');
            candyDiv.classList.add('wishlist-item');

            const img = document.createElement('img');
            img.src = candy.image;
            img.alt = candy.name;
            img.classList.add('candy-image');

            const heartIcon = document.createElement('a');
            heartIcon.innerHTML = '<i class="fa-solid fa-heart"></i>';
            heartIcon.classList.add('heart-icon', 'red-heart');
            heartIcon.addEventListener('click', () => removeItem(index));

            const moveToCartBtn = document.createElement('button');
            moveToCartBtn.innerText = 'Move to Cart';
            moveToCartBtn.classList.add('move-to-cart');
            moveToCartBtn.addEventListener('click', () => moveToCart(index));

            const details = document.createElement('div');
            details.innerHTML = `
                <h3>${candy.name}</h3>
                <p>Flavour: ${candy.flavour}</p>
                <p>Brand: ${candy.brand}</p>
                <p>Price: ${candy.price}&#8377;</p>
            `;

            candyDiv.appendChild(img);
            candyDiv.appendChild(heartIcon);
            candyDiv.appendChild(details);
            candyDiv.appendChild(moveToCartBtn);

            wishlistContainer.appendChild(candyDiv);
        });
    }

    function removeItem(index) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
    }

    function moveToCart(index) {
        const item = wishlist.splice(index, 1)[0]; // Remove from wishlist

        let cartItem = cart.find(candy => candy.name === item.name);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            item.quantity = 1;
            cart.push(item);
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        localStorage.setItem('cart', JSON.stringify(cart));
        renderWishlist();
    }

    renderWishlist();
});
