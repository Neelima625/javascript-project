 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
        import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU",
            authDomain: "signup-39674.firebaseapp.com",
            projectId: "signup-39674",
            storageBucket: "signup-39674.appspot.com",
            messagingSenderId: "253204677214",
            appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
            measurementId: "G-14GSDRDJLX"
        };

        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        // Custom alert function
        function showCustomAlert(message) {
            const alertBox = document.getElementById('customAlert');
            alertBox.textContent = message;
            alertBox.classList.add('show');

            setTimeout(() => {
                alertBox.classList.remove('show');
            }, 3000);
        }

        document.getElementById('navigateButton').addEventListener('click', function() {
            const candyContainer = document.getElementById('candy-container');
            candyContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            const candyContainer = document.getElementById('candy-container');
            const categoryItems = document.querySelectorAll('.category-item');
            const allCandiesLink = document.getElementById('allCandies');
            const searchInput = document.getElementById('searchInput');
            const searchForm = document.getElementById('searchForm');
            const wishlistPageLink = document.getElementById('wishlistPage');

            async function displayCandies(categoryType = null, categoryValue = null, searchTerm = '') {
                candyContainer.innerHTML = '<div class="text-center w-100"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
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
                            const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.trim() !== '');
                            candiesToDisplay = allCandies.filter(candy => {
                                const searchableText = [
                                    candy.name || '',
                                    candy.flavour || '',
                                    candy.brand || '',
                                    candy.color || '',
                                    candy.type || ''
                                ].join(' ').toLowerCase();

                                return searchTerms.every(term => searchableText.includes(term));
                            });
                        }

                        candyContainer.innerHTML = '';

                        if (candiesToDisplay.length === 0) {
                            candyContainer.innerHTML = '<p class="text-center w-100 py-5">No candies found matching your criteria.</p>';
                            return;
                        }

                        candiesToDisplay.forEach(candy => {
                            const candyDiv = document.createElement('div');
                            candyDiv.classList.add('candy-item');
                            candyDiv.style.cursor = 'pointer';
                            candyDiv.dataset.candy = JSON.stringify(candy);

                            const candyName = candy.name.charAt(0).toUpperCase() + candy.name.slice(1);
                            const isWishlisted = isInWishlist(candy);
                            const heartClass = isWishlisted ? 'red-heart' : '';

                            candyDiv.innerHTML = `
                                <div class="img-wrapper">
                                    <img src="${candy.image}" alt="${candy.name}" class="candy-image" />
                                    <a href="#" class="heart-icon ${heartClass}">
                                        <i class="fa-solid fa-heart"></i>
                                    </a>
                                </div>
                                <div class="candy-info">
                                    <h3>${candyName}</h3>
                                    <p class="line-1">
                                        <span class="flavour">Flavour: ${candy.flavour}</span> |
                                        <span class="price">Price: ${candy.price}&#8377;</span> 
                                    </p>
                                    <p class="line-2">
                                        <span class="brand">Brand: ${candy.brand}</span> |
                                        <span class="rating">${candy.rating} <i class="fa fa-star checked"></i></span>
                                    </p>
                                    <button class="addToCartBtn">Add to Cart</button>
                                </div>
                            `;

                            // // Navigate to details page
                            // candyDiv.addEventListener('click', (e) => {
                            //     // Don't navigate if clicking on heart icon or add to cart button
                            //     if (e.target.closest('.heart-icon') || e.target.closest('.addToCartBtn')) {
                            //         return;
                            //     }
                            //     const selectedCandy = JSON.parse(candyDiv.dataset.candy);
                            //     localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy));
                            //     window.location.href = '../candydetails/candys.html';
                            // });

                            // Add to cart
                            candyDiv.querySelector('.addToCartBtn').addEventListener('click', (event) => {
                                event.stopPropagation();
                                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                                const existing = cart.find(item => item.name === candy.name);
                                if (existing) {
                                    existing.quantity += 1;
                                } else {
                                    candy.quantity = 1;
                                    cart.push(candy);
                                }
                                localStorage.setItem('cart', JSON.stringify(cart));
                                showCustomAlert(`${candy.name} added to cart!`);
                            });

                            // Wishlist toggle
                            candyDiv.querySelector('.heart-icon').addEventListener('click', (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleWishlist(candy, event.currentTarget);
                            });

                            candyContainer.appendChild(candyDiv);
                        });
                    } else {
                        candyContainer.innerHTML = '<p class="text-center w-100 py-5">No candies found in the database.</p>';
                    }
                } catch (error) {
                    console.error("Error fetching candies:", error);
                    candyContainer.innerHTML = '<p class="text-center w-100 py-5">Error fetching candies. Please try again later.</p>';
                }
            }

            function toggleWishlist(candy, heartIcon) {
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const index = wishlist.findIndex(item => item.name === candy.name);

                if (index === -1) {
                    wishlist.push(candy);
                    heartIcon.classList.add('red-heart');
                    showCustomAlert(`${candy.name} added to wishlist`);
                } else {
                    wishlist.splice(index, 1);
                    heartIcon.classList.remove('red-heart');
                    showCustomAlert(`${candy.name} removed from wishlist`);
                }

                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            }

            function isInWishlist(candy) {
                const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                return wishlist.some(item => item.name === candy.name);
            }

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

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    displayCandies(null, null, searchTerm);
                }
            });

            // Initial display of all candies
            displayCandies();
        });