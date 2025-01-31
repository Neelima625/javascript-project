const toggleButton = document.querySelector('.toggle-button');
const navList = document.querySelector('.nav-list');

toggleButton.addEventListener('click', () => {
  toggleButton.classList.toggle('active');
  navList.classList.toggle('active');
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU",
    authDomain: "signup-39674.firebaseapp.com",
    projectId: "signup-39674",
    storageBucket: "signup-39674.appspot.com",
    messagingSenderId: "253204677214",
    appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
    measurementId: "G-14GSDRDJLX"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const displayContainer = document.getElementById("candyList");

// 🔹 Fetch Candies by Category & Subcategory
async function fetchAndDisplayCandies(category, subcategory) {
    displayContainer.innerHTML = "<p>Loading...</p>";

    try {
        const dbRef = ref(database, `candies/${category}/${subcategory}`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const candies = snapshot.val();
            displayContainer.innerHTML = `<h2 class="mt-4">${category.toUpperCase()} - ${subcategory.toUpperCase()}</h2>`;

            // ✅ Ensure candies is an object, not an array
            Object.values(candies).forEach(candy => {
                displayContainer.innerHTML += createCandyCard(candy);
            });
        } else {
            displayContainer.innerHTML = `<p>No candies found for ${subcategory} in ${category}.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        displayContainer.innerHTML = "<p>Error loading data.</p>";
    }
}

// 🔹 Function to Generate Candy Card HTML
function createCandyCard(candy) {
    return `
        <div class="card shadow-sm p-3 mb-3" style="border: 1px solid #ddd; display: flex; align-items: center; gap: 10px;">
            <img src="${candy.image}" alt="${candy.name}" style="width: 80px; height: 80px; border-radius: 10px;">
            <div>
                <h5>${candy.name}</h5>
                <p><b>Flavour:</b> ${candy.flavour} | <b>Brand:</b> ${candy.brand}</p>
                <p><b>Color:</b> ${candy.color} | <b>Type:</b> ${candy.type}</p>
                <p><b>Price:</b> $${candy.price} | <b>Rating:</b> ${candy.rating}⭐</p>
            </div>
        </div>
    `;
}

// 🔹 Add Event Listeners to Navbar Items
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".dropdown-menu .category-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            // ✅ Get category & subcategory
            const category = this.getAttribute("data-category");
            const subcategory = this.innerText.trim().toLowerCase();

            // ✅ Fetch and display candies
            fetchAndDisplayCandies(category, subcategory);
        });
    });

    // ✅ Fetch all candies when "All Candies" is clicked
    document.getElementById("allCandies").addEventListener("click", (e) => {
        e.preventDefault();
        fetchAndDisplayAllCandies();
    });
});

// 🔹 Fetch and Display All Candies
async function fetchAndDisplayAllCandies() {
    displayContainer.innerHTML = "<p>Loading all candies...</p>";

    try {
        const dbRef = ref(database, "candies");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const allCandies = snapshot.val();
            displayContainer.innerHTML = `<h2 class="mt-4">All Candies</h2>`;

            Object.keys(allCandies).forEach(category => {
                Object.keys(allCandies[category]).forEach(subcategory => {
                    Object.values(allCandies[category][subcategory]).forEach(candy => {
                        displayContainer.innerHTML += createCandyCard(candy);
                    });
                });
            });
        } else {
            displayContainer.innerHTML = `<p>No candies found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching all candies:", error);
        displayContainer.innerHTML = "<p>Error loading all candies.</p>";
    }
}
