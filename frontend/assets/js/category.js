// Selectors
const navButtons = document.querySelectorAll(".nav-btn");
const categoriesSection = document.getElementById("categories");
const itemGrid = document.getElementById("item-grid");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category");

let products = {}; // Declare the products object outside to ensure it is available globally

function convertToCategoryFormat(data) {
    const result = {
        woman: {
            tops: [],
            bottoms: [],
            outerwear: [],
            dresses: [],
        },
        man: {
            tops: [],
            bottoms: [],
            outerwear: [],
            activewear: [],
        }
    };

    data.forEach(item => {
        const gender = item.gender === "M" ? "man" : "woman";

        let category = "";
        switch (item.part) {
            case "T":
                category = "tops";
                break;
            case "B":
                category = "bottoms";
                break;
            case "O":
                category = "outerwear";
                break;
            case "A":
                category = "activewear";
                break;
            case "D":
                category = "dresses";
                break;
            default:
                break;
        }

        if (category) {
            result[gender][category].push({
                clothes_id: item.clothes_id,
                name: item.name,
                price: `${item.price} NTD`,
                img: ".." + item.img,
                color: item.color || "NA", // Default color
            });
        }
    });

    return result;
}

// Store current selected gender and category
let selectedGender = null;
let selectedCategory = null;

// Function to toggle welcome picture visibility
function toggleWelcomePicture() {
    const welcomePicture = document.getElementById("welcome-picture");
    const itemGrid = document.getElementById("item-grid");

    // Check if gender or category or search query is set
    if (selectedGender || selectedCategory || searchInput.value.trim() !== "") {
        welcomePicture.classList.add("hidden");
        itemGrid.classList.remove("hidden");
        categoriesSection.classList.remove("hidden");  // Ensure categories section is shown if gender is selected
    } else {
        welcomePicture.classList.remove("hidden");
        itemGrid.classList.add("hidden");
        categoriesSection.classList.add("hidden");  // Hide categories section if no gender is selected
    }
}


// Add event listener to gender buttons
navButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Existing logic for selecting gender
        navButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedGender = button.dataset.gender;

        // Show categories section based on the selected gender
        updateCategoryButtons();

        // Save the state to sessionStorage
        saveState();

        // Toggle welcome picture and display products
        toggleWelcomePicture();
        displayProducts();
    });
});

// Function to update category buttons based on selected gender
function updateCategoryButtons() {
    // Get all category buttons
    const categoryButtons = document.querySelectorAll(".category");

    // Clear all existing categories
    categoryButtons.forEach(button => button.classList.add("hidden"));

    // Get category buttons for the selected gender
    const genderCategories = selectedGender === 'woman' ? ['all', 'tops', 'bottoms', 'outerwear', 'dresses'] : ['all', 'tops', 'bottoms', 'outerwear', 'activewear'];

    // Show only the categories relevant to the selected gender
    genderCategories.forEach(category => {
        const categoryButton = document.querySelector(`.category[data-category="${category}"]`);
        if (categoryButton) {
            categoryButton.classList.remove("hidden");
        }
    });
}

// Add event listener to category buttons
categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        // Existing logic for selecting category
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedCategory = button.dataset.category;

        // Save the state to sessionStorage
        saveState();

        // Toggle welcome picture and display products
        toggleWelcomePicture();
        displayProducts();
    });
});

// Event listener for search input
searchInput.addEventListener("input", function () {
    // Re-display products with search filter applied
    saveState();
    toggleWelcomePicture();
    if (selectedGender) {
        displayProducts();
    }
});

// Save current filter state to sessionStorage
function saveState() {
    const state = {
        selectedGender,
        selectedCategory,
        searchQuery: searchInput.value.trim(),
    };
    sessionStorage.setItem("filtersState", JSON.stringify(state));
}

// Function to display products based on selected filters
function displayProducts() {
    itemGrid.innerHTML = ""; // Clear current products

    // If gender is selected
    if (selectedGender) {
        const genderProducts = products[selectedGender];

        if (selectedCategory != 'all' && selectedCategory && genderProducts[selectedCategory]) {
            const filteredProducts = genderProducts[selectedCategory].filter(product => {
                const searchText = searchInput.value.toLowerCase();
                return product.name.toLowerCase().includes(searchText);
            });

            // Display filtered products
            filteredProducts.forEach(product => {
                const card = document.createElement("div");
                card.className = "item-card";
                card.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" class="product-img" data-product-name="${product.name}" data-product-price="${product.price}" data-product-img="${product.img}" data-product-clothes-id="${product.clothes_id}" data-product-color="${product.color}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                `;
                itemGrid.appendChild(card);
            });

            // If no products match
            if (filteredProducts.length === 0) {
                itemGrid.innerHTML = "<p>No items available in this category.</p>";
            }
        } else {
            // Display all products for the selected gender
            let allProducts = [];
            for (const category in genderProducts) {
                allProducts = allProducts.concat(genderProducts[category]);
            }

            const filteredProducts = allProducts.filter(product => {
                const searchText = searchInput.value.toLowerCase();
                return product.name.toLowerCase().includes(searchText);
            });

            filteredProducts.forEach(product => {
                const card = document.createElement("div");
                card.className = "item-card";
                card.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" class="product-img" data-product-name="${product.name}" data-product-price="${product.price}" data-product-img="${product.img}" data-product-clothes-id="${product.clothes_id}" data-product-color="${product.color}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                `;
                itemGrid.appendChild(card);
            });

            // If no products match
            if (filteredProducts.length === 0) {
                itemGrid.innerHTML = "<p>No products found matching your search.</p>";
            }
        }
    }

    // Add event listener to product images for redirection
    const productImages = document.querySelectorAll(".product-img");
    productImages.forEach(image => {
        image.addEventListener("click", function () {
            // Save the current state in sessionStorage
            const state = {
                selectedGender,
                selectedCategory,
                searchQuery: searchInput.value.trim(),
            };
            sessionStorage.setItem("filtersState", JSON.stringify(state));

            // Get product details from data attributes
            const productName = image.dataset.productName;
            const productPrice = image.dataset.productPrice;
            const productImg = image.dataset.productImg;
            const productClothesId = image.dataset.productClothesId;
            const productColor = image.dataset.productColor;

            // Redirect to item.html with product details (query parameters)
            window.location.href = `item?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&img=${encodeURIComponent(productImg)}&cloth_id=${encodeURIComponent(productClothesId)}&color=${encodeURIComponent(productColor)}`;
        });
    });
}

// Restore state from sessionStorage
window.addEventListener("load", async function () {
    try {
        const response = await fetch(`${serverURL}/category_load_clothes_data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            products = result; // Set the result from the API into the products object
            console.log(result); // Log the response from Flask

            // Now that data is fetched and stored in 'products', convert it to the desired format
            products = convertToCategoryFormat(products);
            console.log(products); // Log the formatted products
        } else {
            console.error("Failed to fetch data:", response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }

    const savedState = JSON.parse(sessionStorage.getItem("filtersState"));

    if (savedState) {
        // Restore gender
        selectedGender = savedState.selectedGender;
        if (selectedGender) {
            const activeGenderButton = document.querySelector(`.nav-btn[data-gender="${selectedGender}"]`);
            if (activeGenderButton) activeGenderButton.classList.add("active");

            // Update the categories based on the selected gender
            updateCategoryButtons();
        }

        // Restore category
        selectedCategory = savedState.selectedCategory;
        if (selectedCategory) {
            const activeCategoryButton = document.querySelector(`.category[data-category="${selectedCategory}"]`);
            if (activeCategoryButton) activeCategoryButton.classList.add("active");
        }

        // Restore search input
        searchInput.value = savedState.searchQuery || "";

        // Display products based on restored state
        toggleWelcomePicture();
        displayProducts();
    }
});