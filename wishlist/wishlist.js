// wishlist.js

document.addEventListener('DOMContentLoaded', () => {
    const wishlistContainer = document.getElementById('wishlist-container');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    wishlist.forEach(candy => {
        const candyDiv = document.createElement('div');
        candyDiv.classList.add('wishlist-item');

        const img = document.createElement('img');
        img.src = candy.image;
        img.alt = candy.name;
        img.classList.add('candy-image');

        const heartIcon = document.createElement('a');
        heartIcon.innerHTML = '<i class="fa-solid fa-heart"></i>';
        heartIcon.classList.add('heart-icon', 'red-heart'); // Always red in wishlist

        candyDiv.appendChild(img);
        candyDiv.appendChild(heartIcon);
        candyDiv.innerHTML += `
            <h3>${candy.name}</h3>
            <p>Flavour: ${candy.flavour}</p>
            <p>Brand: ${candy.brand}</p>
            <p>Price: ${candy.price}&#8377;</p>
        `;

        wishlistContainer.appendChild(candyDiv);
    });
});