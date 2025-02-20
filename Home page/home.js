import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration (replace with your actual config)
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
document.addEventListener('DOMContentLoaded', () => {
    const candyContainer = document.getElementById('candy-container');
    const categoryItems = document.querySelectorAll('.category-item');
    const allCandiesLink = document.getElementById('allCandies');

    async function displayCandies(categoryType, categoryValue) {
        candyContainer.innerHTML = ''; // Clear existing content

        const candiesRef = ref(database, 'candies');

        try {
            const snapshot = await get(candiesRef);
            const candiesData = snapshot.val();

            if (candiesData) {
                const allCandies = [];
                for (const category in candiesData) {
                    for (const subcategory in candiesData[category]) {
                        const candyArray = candiesData[category][subcategory];
                        if (Array.isArray(candyArray)) {
                            allCandies.push(...candyArray);
                        }
                    }
                }

                let candiesToDisplay = allCandies;

                if (categoryType && categoryValue) {
                    candiesToDisplay = allCandies.filter(candy => {
                        if (Array.isArray(candy[categoryType])) {
                            return candy[categoryType].some(val => val.toLowerCase() === categoryValue.toLowerCase());
                        } else {
                            const candyValueLower = candy[categoryType]?.toLowerCase();
                            return candyValueLower === categoryValue.toLowerCase();
                        }
                    });
                }

                if (candiesToDisplay.length === 0) {
                    candyContainer.innerHTML = '<p>No candies found for this category.</p>';
                    return;
                }

                candiesToDisplay.forEach(candy => {
                    const candyDiv = document.createElement('div');
                    candyDiv.classList.add('candy-item');
                    candyDiv.style.cursor = 'pointer';
                    candyDiv.dataset.candy = JSON.stringify(candy);
                    candyDiv.addEventListener('click', () => {
                        const selectedCandy = JSON.parse(candyDiv.dataset.candy);
                        localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy)); // Store in local storage
                        window.location.href = '../candydetails/candys.html'; // Navigate to details page
                    });
        
                    const img = document.createElement('img');
                    img.src = candy.image;
                    img.alt = candy.name;
                    img.classList.add('candy-image');
                    candyDiv.appendChild(img);

                    candyDiv.innerHTML += `
                        <h3>${candy.name}</h3>
                        <p>Flavour: ${Array.isArray(candy.flavour) ? candy.flavour.join(', ') : candy.flavour}</p>
                        <p>Brand: ${candy.brand}</p>
                        <p>Price: ${candy.price}&#8377;</p>
                        <button class="rating"> ${candy.rating}<span class="fa fa-star checked"></span></button>
                    `;

                    candyContainer.appendChild(candyDiv);
                });

                // Smooth scrolling after candies are displayed
                candyContainer.scrollIntoView({ behavior: 'smooth' });

            } else {
                candyContainer.innerHTML = '<p>No candies found.</p>';
            }
        } catch (error) {
            console.error("Error fetching candies:", error);
            candyContainer.innerHTML = '<p>Error fetching candies.</p>';
        }
    }

    categoryItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryType = event.target.dataset.category;
            const categoryValue = event.target.textContent;
            displayCandies(categoryType, categoryValue);
        });
    });

    allCandiesLink.addEventListener('click', (event) => {
        event.preventDefault();
        displayCandies();
    });

    displayCandies(); // Initial display
});