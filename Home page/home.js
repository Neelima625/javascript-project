import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU", // Replace with your API key
    authDomain: "signup-39674.firebaseapp.com",
    projectId: "signup-39674",
    storageBucket: "signup-39674.appspot.com",
    messagingSenderId: "253204677214",
    appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
    measurementId: "G-14GSDRDJLX"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const candyContainer = document.getElementById('candy-container');
    const categoryItems = document.querySelectorAll('.category-item');
    const allCandiesLink = document.getElementById('allCandies');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const wishlistPageLink = document.getElementById('wishlistPage'); // Add this ID to your wishlist button

    async function displayCandies(categoryType, categoryValue, searchTerm = '') {
        candyContainer.innerHTML = ''; // Clear existing content
        const candiesRef = ref(database, 'candies');

        try {
            const snapshot = await get(candiesRef);
            const candiesData = snapshot.val();

            if (candiesData) {
                const allCandies = Object.values(candiesData);
                let candiesToDisplay = allCandies;

                if (categoryType && categoryValue) {
                    candiesToDisplay = allCandies.filter(candy => {
                        if (categoryType === 'flavour') {
                            return candy.flavour && candy.flavour.toLowerCase() === categoryValue.toLowerCase();
                        } else if (categoryType === 'color') {
                            return candy.color && candy.color.toLowerCase() === categoryValue.toLowerCase();
                        } else if (categoryType === 'brand') {
                            return candy.brand && candy.brand.toLowerCase() === categoryValue.toLowerCase();
                        } else if (categoryType === 'type') {
                            return candy.type && candy.type.toLowerCase() === categoryValue.toLowerCase();
                        }
                        return false;
                    });
                }

                if (searchTerm) {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    candiesToDisplay = candiesToDisplay.filter(candy => {
                        return (candy.name && candy.name.toLowerCase().includes(lowerSearchTerm)) ||
                               (candy.flavour && candy.flavour.toLowerCase().includes(lowerSearchTerm)) ||
                               (candy.brand && candy.brand.toLowerCase().includes(lowerSearchTerm)) ||
                               (candy.color && candy.color.toLowerCase().includes(lowerSearchTerm)) ||
                               (candy.type && candy.type.toLowerCase().includes(lowerSearchTerm));
                    });
                }

                if (candiesToDisplay.length === 0) {
                    candyContainer.innerHTML = '<p>No candies found.</p>';
                    return;
                }

                candiesToDisplay.forEach(candy => {
                    const candyDiv = document.createElement('div');
                    let addToCartBtn = document.createElement('button');
                    addToCartBtn.classList.add('addToCartBtn')
                    addToCartBtn.textContent = "Add to Cart";
                    
                    
                    candyDiv.classList.add('candy-item');
                    candyDiv.style.cursor = 'pointer';
                    candyDiv.dataset.candy = JSON.stringify(candy);
                
                    candyDiv.addEventListener('click', () => {
                        const selectedCandy = JSON.parse(candyDiv.dataset.candy);
                        localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy));
                        window.location.href = '../candydetails/candys.html';
                    });
                
                    // Image Wrapper
                    const imgWrapper = document.createElement('div');
                    imgWrapper.classList.add('img-wrapper');
                
                    const img = document.createElement('img');
                    img.src = candy.image;
                    img.alt = candy.name;
                    img.classList.add('candy-image');
                
                    // Wishlist Heart Icon
                    const heartIcon = document.createElement('a');
                    heartIcon.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    heartIcon.classList.add('heart-icon', 'black-heart');
                    heartIcon.href = '#';
                
                    if (isInWishlist(candy)) {
                        heartIcon.classList.add('red-heart');
                        heartIcon.classList.remove('black-heart');
                    }
                
                    heartIcon.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleWishlist(candy, heartIcon);
                    });
                
                    // Append heart icon to image
                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(heartIcon);
                
                    // Candy Info
                    const infoContainer = document.createElement('div');
                    infoContainer.classList.add('candy-info');
                
                    const candyName = document.createElement('h3');
                    candyName.textContent = candy.name;
                
                    const flavour = document.createElement('p');
                    flavour.textContent = `Flavour: ${candy.flavour}`;
                
                    const brand = document.createElement('p');
                    brand.textContent = `Brand: ${candy.brand}`;
                
                    const price = document.createElement('p');
                    price.innerHTML = `Price: ${candy.price}&#8377;`;
                
                    const ratingButton = document.createElement('button');
                    ratingButton.classList.add('rating');
                    ratingButton.innerHTML = `${candy.rating} <span class="fa fa-star checked"></span>`;
                
                    // **Add to Cart Button Functionality**
                    addToCartBtn.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevents triggering the main click event
                
                        let cart = JSON.parse(localStorage.getItem('cart')) || [];
                        
                        // Check if candy already exists in cart
                        const existingCandy = cart.find(item => item.name === candy.name);
                        if (existingCandy) {
                            existingCandy.quantity += 1; // Increase quantity if it already exists
                        } else {
                            candy.quantity = 1; // Initialize quantity
                            cart.push(candy);
                        }
                
                        localStorage.setItem('cart', JSON.stringify(cart));
                
                        alert(`${candy.name} added to cart!`);
                    });
                
                    // Append elements properly
                    infoContainer.appendChild(candyName);
                    infoContainer.appendChild(flavour);
                    infoContainer.appendChild(brand);
                    infoContainer.appendChild(price);
                    infoContainer.appendChild(ratingButton);
                
                    candyDiv.appendChild(imgWrapper);
                    candyDiv.append(infoContainer, addToCartBtn);
                
                    candyContainer.appendChild(candyDiv);
                });
                
                
                
            } else {
                candyContainer.innerHTML = '<p>No candies found.</p>';
            }
        } catch (error) {
            console.error("Error fetching candies:", error);
            candyContainer.innerHTML = '<p>Error fetching candies.</p>';
        }
    }

    function toggleWishlist(candy, heartIcon) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const index = wishlist.findIndex(item => item.name === candy.name);
    
        if (index === -1) {
            wishlist.push(candy);
            heartIcon.classList.add('red-heart');
            heartIcon.classList.remove('black-heart');
        } else {
            wishlist.splice(index, 1);
            heartIcon.classList.remove('red-heart');
            heartIcon.classList.add('black-heart');
        }
    
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    

    function isInWishlist(candy) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        return wishlist.some(item => item.name === candy.name);
    }
    

    // Navigate to Wishlist Page
    wishlistPageLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../wishlist/wishlist.html';
    });

    categoryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryType = event.target.dataset.category;
            const categoryValue = event.target.textContent;
            displayCandies(categoryType, categoryValue);
            candyContainer.scrollIntoView({ behavior: 'smooth' });
        });
    });

    allCandiesLink.addEventListener('click', (event) => {
        event.preventDefault();
        displayCandies();
        candyContainer.scrollIntoView({ behavior: 'smooth' });
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        displayCandies(null, null, searchTerm);
        candyContainer.scrollIntoView({ behavior: 'smooth' });
    });

    displayCandies();
});
