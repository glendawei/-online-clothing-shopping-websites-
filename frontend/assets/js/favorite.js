// const products = [
//     { id: 1, name: "Blazer", price: "100 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 2, name: "T-shirt", price: "60 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 3, name: "Sweater", price: "150 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 4, name: "Tank Top", price: "50 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 5, name: "Blouse", price: "80 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 6, name: "Crop Top", price: "70 NTD", img: "https://via.placeholder.com/100x150" },
//     { id: 7, name: "Button-down Shirt", price: "90 NTD", img: "https://via.placeholder.com/100x150" },
// ];

products = []; // Declare the products object outside to ensure it is available globally
window.onload = async function () {
    console.log(get_user_id());
    try {
        const response = await fetch(`${serverURL}/favorite_load_favorite_clothes?user_id=${get_user_id()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            products = result; // Set the result from the API into the products object
            console.log(products); // Log the response from Flask
            // Initialize product display
            displayProducts(products);
        } else {
            console.error("Failed to fetch data:", response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const container = document.getElementById("favorites");

// Function to create product cards
function displayProducts(products) {
    container.innerHTML = ""; // Clear container
    products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id;

        card.innerHTML = `
            <img src="${".." + product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <div class="trash-icon" onclick="removeProduct(${product.id}, '${product.color}')">&#128465</div>
            <button class="add-to-bag" onclick="addToBag(${product.id}, '${product.color}')">Add to Bag</button>
        `;

        container.appendChild(card);
    });
}

function addToBag(productId, productColor) {
    const product = products.find(p => (p.id === productId && p.color === productColor));
    if (product) {
        const productName = product.name;
        const productPrice = product.price;
        const productImg = product.img;
        const productClothID = product.id; // Assuming ID represents cloth_id
        const productColor = product.color || "default"; // Replace with actual color if available

        // Redirect to the URL
        window.location.href = `item?name=${encodeURIComponent(productName)}&price=${encodeURIComponent(productPrice)}&img=${encodeURIComponent(productImg)}&cloth_id=${encodeURIComponent(productClothID)}&color=${encodeURIComponent(productColor)}`;
    }
}

async function deleteItemFromFavorite(user_id_d, clothes_id, color) {
    const data = {
        user_id: user_id_d,
        clothes_id: clothes_id,
        color: color
    };
  
    try {
        const response = await fetch(`${serverURL}/favorite_delete_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Send the data in the request body as JSON
        });
  
        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            console.log(result.message); // Output: "successfully deleted!"
        } else {
            console.error('Failed to delete item from bag:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }

// Function to remove product from favorites
function removeProduct(id, color) {
    const index = products.findIndex((p) => (p.id === id && p.color === color));
    if (index !== -1) {
        deleteItemFromFavorite(get_user_id(), products[index].id, products[index].color)
        products.splice(index, 1);
        displayProducts(products);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // 處理 Logo 點擊事件
    const logoLink = document.querySelector(".logo a");
    if (logoLink) {
        logoLink.addEventListener("click", function (event) {
            event.preventDefault(); // 防止默認行為，測試是否能手動控制跳轉
            const targetUrl = logoLink.getAttribute("href");
            if (targetUrl) {
                window.location.href = targetUrl; // 手動跳轉到目標頁面
            } else {
                console.error("連結沒有指定目標頁面");
            }
        });
    } else {
        console.error("找不到 .logo a 元素");
    }
    const wButton = document.querySelector(".nav-btn[data-gender='woman']"); 
    if (wButton) {
        wButton.addEventListener("click", function() {
            console.log("女性按鈕被點擊");
            window.location.href = `category?gender=woman`;  
        });
    } else {
        console.error("找不到女性性別按鈕");
    }
  
    const mButton = document.querySelector(".nav-btn[data-gender='man']");
    if (mButton) {
        mButton.addEventListener("click", function() {
            console.log("男性按鈕被點擊");
            window.location.href = `category?gender=man`;
        });
    } else {
        console.error("找不到男性性別按鈕");
    }
  });
  



