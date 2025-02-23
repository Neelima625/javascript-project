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
                               (candy.color && candy.color.toLowerCase().includes(lowerSearchTerm))||
                               (candy.type && candy.type.toLowerCase().includes(lowerSearchTerm));

                    });
                }

                if (candiesToDisplay.length === 0) {
                    candyContainer.innerHTML = '<p>No candies found.</p>';
                    return;
                }

                candiesToDisplay.forEach(candy => {
                    const candyDiv = document.createElement('div');
                    candyDiv.classList.add('candy-item');
                    candyDiv.style.cursor = 'pointer';
                    candyDiv.dataset.candy = JSON.stringify(candy);
                    candyDiv.addEventListener('click', () => {
                        const selectedCandy = JSON.parse(candyDiv.dataset.candy);
                        localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy));
                        window.location.href = '../candydetails/candys.html';
                    });
                    const img = document.createElement('img');
                    img.src = candy.image;
                    img.alt = candy.name;
                    img.classList.add('candy-image');
                    candyDiv.appendChild(img);

                    candyDiv.innerHTML += `
                        <h3>${candy.name}</h3>
                        <p>Flavour: ${candy.flavour}</p>
                        <p>Brand: ${candy.brand}</p>
                        <p>Price: ${candy.price}&#8377;</p>
                        <button class="rating"> ${candy.rating}<span class="fa fa-star checked"></span></button>
                    `;

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
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// // Firebase configuration (replace with your actual config)
// const firebaseConfig = {
//     apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU", // Replace with your API key
//     authDomain: "signup-39674.firebaseapp.com",
//     projectId: "signup-39674",
//     storageBucket: "signup-39674.appspot.com",
//     messagingSenderId: "253204677214",
//     appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
//     measurementId: "G-14GSDRDJLX"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// document.addEventListener('DOMContentLoaded', () => {
//     const candyContainer = document.getElementById('candy-container');
//     const categoryItems = document.querySelectorAll('.category-item');
//     const allCandiesLink = document.getElementById('allCandies');
//     const searchInput = document.getElementById('searchInput'); // Get search input
//     const searchForm = document.getElementById('searchForm'); // Get search form

//     async function displayCandies(categoryType, categoryValue) {
//         candyContainer.innerHTML = ''; // Clear existing content

//         const candiesRef = ref(database, 'candies');

//         try {
//             const snapshot = await get(candiesRef);
//             const candiesData = snapshot.val();

//             if (candiesData) {
//                 const allCandies = Object.values(candiesData); // Get the array of candies

//                 let candiesToDisplay = allCandies; // Default: display all candies

//                 if (categoryType && categoryValue) { // Filter if category and value are provided
//                     candiesToDisplay = allCandies.filter(candy => {
//                         if (categoryType === 'flavour') {
//                             return candy.flavour && candy.flavour.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'color') {
//                             return candy.color && candy.color.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'brand') {
//                             return candy.brand && candy.brand.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'type') {
//                             return candy.type && candy.type.toLowerCase() === categoryValue.toLowerCase();
//                         }
//                         return false;
//                     });
//                 }

//                 if (candiesToDisplay.length === 0) {
//                     candyContainer.innerHTML = '<p>No candies found for this category.</p>';
//                     return;
//                 }

//                 candiesToDisplay.forEach(candy => {
//                                         const candyDiv = document.createElement('div');
//                                         candyDiv.classList.add('candy-item');
//                                         candyDiv.style.cursor = 'pointer';
//                                         candyDiv.dataset.candy = JSON.stringify(candy);
//                                         candyDiv.addEventListener('click', () => {
//                                             const selectedCandy = JSON.parse(candyDiv.dataset.candy);
//                                             localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy)); // Store in local storage
//                                             window.location.href = '../candydetails/candys.html'; // Navigate to details page
//                                         });
//                     const img = document.createElement('img');
//                     img.src = candy.image;
//                     img.alt = candy.name;
//                     img.classList.add('candy-image');
//                     candyDiv.appendChild(img);

//                     candyDiv.innerHTML += `
//                         <h3>${candy.name}</h3>
//                         <p>Flavour: ${candy.flavour}</p>
//                         <p>Brand: ${candy.brand}</p>
//                         <p>Price: ${candy.price}&#8377;</p>
//                         <button class="rating"> ${candy.rating}<span class="fa fa-star checked"></span></button>
//                     `;

//                     candyContainer.appendChild(candyDiv);
//                 });
//             } else {
//                 candyContainer.innerHTML = '<p>No candies found.</p>';
//             }
//         } catch (error) {
//             console.error("Error fetching candies:", error);
//             candyContainer.innerHTML = '<p>Error fetching candies.</p>';
//         }
//     }

//     categoryItems.forEach(item => {
//         item.addEventListener('click', (event) => {
//             event.preventDefault();
//             const categoryType = event.target.dataset.category;
//             const categoryValue = event.target.textContent;
//             displayCandies(categoryType, categoryValue);
//             candyContainer.scrollIntoView({ behavior: 'smooth' });
//         });
//     });

//     allCandiesLink.addEventListener('click', (event) => {
//         event.preventDefault();
//         displayCandies();
//         candyContainer.scrollIntoView({ behavior: 'smooth' });
//     });

//     displayCandies(); // Initial display of all candies on page load
// });
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// // Firebase configuration (replace with your actual config)
// const firebaseConfig = {
//     apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU", // Replace with your API key
//     authDomain: "signup-39674.firebaseapp.com",
//     projectId: "signup-39674",
//     storageBucket: "signup-39674.appspot.com",
//     messagingSenderId: "253204677214",
//     appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
//     measurementId: "G-14GSDRDJLX"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// document.addEventListener('DOMContentLoaded', () => {
//     const candyContainer = document.getElementById('candy-container');
//     const categoryItems = document.querySelectorAll('.category-item');
//     const allCandiesLink = document.getElementById('allCandies');
//     const searchInput = document.getElementById('searchInput');
//     const searchForm = document.getElementById('searchForm');

//     async function displayCandies(categoryType, categoryValue, searchTerm = '') {
//         candyContainer.innerHTML = ''; // Clear existing content

//         const candiesRef = ref(database, 'candies');

//         try {
//             const snapshot = await get(candiesRef);
//             const candiesData = snapshot.val();

//             if (candiesData) {
//                 const allCandies = Object.values(candiesData);

//                 let candiesToDisplay = allCandies;

//                 if (categoryType && categoryValue) {
//                     candiesToDisplay = allCandies.filter(candy => {
//                         if (categoryType === 'flavour') {
//                             return candy.flavour && candy.flavour.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'color') {
//                             return candy.color && candy.color.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'brand') {
//                             return candy.brand && candy.brand.toLowerCase() === categoryValue.toLowerCase();
//                         } else if (categoryType === 'type') {
//                             return candy.type && candy.type.toLowerCase() === categoryValue.toLowerCase();
//                         }
//                         return false;
//                     });
//                 }

//                 if (searchTerm) {
//                     const lowerSearchTerm = searchTerm.toLowerCase();
//                     candiesToDisplay = candiesToDisplay.filter(candy => {
//                         return (candy.name && candy.name.toLowerCase().includes(lowerSearchTerm)) ||
//                                (candy.flavour && candy.flavour.toLowerCase().includes(lowerSearchTerm)) ||
//                                (candy.brand && candy.brand.toLowerCase().includes(lowerSearchTerm));

//                     });
//                 }

//                 if (candiesToDisplay.length === 0) {
//                     candyContainer.innerHTML = '<p>No candies found.</p>';
//                     return;
//                 }

//                 candiesToDisplay.forEach(candy => {
//                     const candyDiv = document.createElement('div');
//                     candyDiv.classList.add('candy-item');
//                     candyDiv.style.cursor = 'pointer';
//                     candyDiv.dataset.candy = JSON.stringify(candy);
//                     candyDiv.addEventListener('click', () => {
//                         const selectedCandy = JSON.parse(candyDiv.dataset.candy);
//                         localStorage.setItem('selectedCandy', JSON.stringify(selectedCandy));
//                         window.location.href = '../candydetails/candys.html';
//                     });
//                     const img = document.createElement('img');
//                     img.src = candy.image;
//                     img.alt = candy.name;
//                     img.classList.add('candy-image');
//                     candyDiv.appendChild(img);

//                     candyDiv.innerHTML += `
//                         <h3>${candy.name}</h3>
//                         <p>Flavour: ${candy.flavour}</p>
//                         <p>Brand: ${candy.brand}</p>
//                         <p>Price: ${candy.price}&#8377;</p>
//                         <button class="rating"> ${candy.rating}<span class="fa fa-star checked"></span></button>
//                     `;

//                     candyContainer.appendChild(candyDiv);
//                 });
//             } else {
//                 candyContainer.innerHTML = '<p>No candies found.</p>';
//             }
//         } catch (error) {
//             console.error("Error fetching candies:", error);
//             candyContainer.innerHTML = '<p>Error fetching candies.</p>';
//         }
//     }

//     categoryItems.forEach(item => {
//         item.addEventListener('click', (event) => {
//             event.preventDefault();
//             const categoryType = event.target.dataset.category;
//             const categoryValue = event.target.textContent;
//             displayCandies(categoryType, categoryValue);
//             candyContainer.scrollIntoView({ behavior: 'smooth' });
//         });
//     });

//     allCandiesLink.addEventListener('click', (event) => {
//         event.preventDefault();
//         displayCandies();
//         candyContainer.scrollIntoView({ behavior: 'smooth' });
//     });

//     searchForm.addEventListener('submit', (event) => {
//         event.preventDefault();
//         const searchTerm = searchInput.value.trim();
//         displayCandies(null, null, searchTerm);
//         candyContainer.scrollIntoView({ behavior: 'smooth' });
//     });

//     displayCandies();
// });