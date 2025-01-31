import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Form submission event
document.getElementById("candy_details").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const id = document.getElementById("id").value.trim();
    const name = document.getElementById("name").value.trim();
    const image = document.getElementById("image").value.trim();
    const rating = document.getElementById("rating").value.trim();
    const color = document.getElementById("color").value.trim();
    const type = document.getElementById("type").value.trim();
    const flavour = document.getElementById("flavour").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const price = document.getElementById("price").value.trim();

    // Ensure required fields are filled
    if (!id || !name || !image || !rating || !flavour || !brand || !color || !type || !price) {
        console.error("All fields are required!");
        return;
    }

    // Candy object to store
    const candyData = { id, name, image, rating, color, type, flavour, brand, price };

    // Function to update each category with subcategories
    async function updateCategory(category, subcategory) {
        const dbRef = ref(database, `candies/${category}/${subcategory}`);

        try {
            // Fetch existing data
            const snapshot = await get(dbRef);
            let candyArray = snapshot.exists() ? snapshot.val() : [];

            // Ensure it's an array
            if (!Array.isArray(candyArray)) {
                candyArray = [];
            }

            // Add new candy data
            candyArray.push(candyData);

            // Save updated data
            await set(dbRef, candyArray);
            console.log(`Added to ${category}: ${subcategory}`);
        } catch (error) {
            console.error(`Error adding data to ${category}:`, error.message || error);
        }
    }

    // Store in four separate main categories with subcategories
    await updateCategory("flavour", flavour);
    await updateCategory("color", color);
    await updateCategory("type", type);
    await updateCategory("brand", brand);

    console.log("Candy added successfully!");

    // Reset the form
    document.getElementById("candy_details").reset();
});
