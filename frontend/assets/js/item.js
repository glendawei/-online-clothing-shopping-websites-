// Get query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const productName = urlParams.get('name');
const productPrice = urlParams.get('price');
const productImg = urlParams.get('img');
const productClothID = urlParams.get('cloth_id');
const productInitColor = urlParams.get('color');

// Update HTML elements with product details
document.getElementById("product-name").textContent = productName;
document.getElementById("product-price").textContent = productPrice;
document.getElementById("product-img").src = productImg;
document.getElementById("product-img").alt = productName;

// Get the image element
const productImgElement = document.getElementById("product-img");

// Adjust image dimensions
productImgElement.style.width = "500px";  // Set the width to 400px
productImgElement.style.height = "600px";  // Set the height to 600px
productImgElement.style.objectFit = "cover";  // Crop and fill the box

document.getElementById("add-to-favorite").addEventListener("click", function () {
    // Get the selected color and size
    const selectedColor = document.getElementById("color").value;

    // Pass the selected options to the function
    addItemToFavorite(productClothID, selectedColor);
});

function addItemToBag() {
    const color = document.getElementById("color").value;
    const size = document.getElementById("size").value;
    const quantity = document.getElementById("num").value;

    fetch(`/add-to-bag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: get_user_id(),
            clothes_id: productClothID,
            color: color.toUpperCase(),
            size: size,
            quantity: quantity
        })
    })
    .then(response => {
        if (!response.ok) {
            alert("Failed to add item to your bag. Please try again.");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(data.success === -2)  // insufficient stock
            alert(`${productName} (${color}, ${size}) has only ${data.quantity} stocks remaining. Sorry :(`);
        else if(data.success === -1)  // duplicate bag add
            alert(`You already added ${productName} (${color}, ${size}) into your bag!`);
        else if(data.success === 0)
            alert(`${productName} (${color}, ${size}) has been added to your bag!`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while adding the item to your bag.");
    });
}

function addItemToFavorite(clothes_id, color) {
    fetch(`/add-to-favorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: get_user_id(),
            clothes_id: clothes_id,
            color: color.toUpperCase()
        })
    })
    .then(response => {
        if (!response.ok) {
            alert("Failed to add item to your favorites. Please try again.");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(data.success === -1)
            alert(`You already added ${productName} (${color}) into your favorites!`);
        else if(data.success === 0)
            alert(`${productName} (${color}) has been added to your favorites!`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while adding the item to your favorites.");
    });
}

// Handle "Try On" button
document.getElementById("try-on").addEventListener("click", function () {
    const productImg = document.getElementById("product-img");
    // Redirect to the try-on page
    var tryOnLink = `try-on?`
    tryOnLink += `cloth_id=${productClothID}&`
    tryOnLink += `color=${colorSelect.value}&`
    tryOnLink += `img=${productImg.src}`
    window.location.href = tryOnLink;
});

// Get the Go Back button
const goBackButton = document.querySelector(".go-back-btn");

// Add an event listener to handle the click event
goBackButton.addEventListener("click", function () {
    // Navigate back to category
    window.location.href = "category";
});


// when page is loaded, fetch colors from db
var colorSelect = document.getElementById("color");
const colorvalColornameMap = {
    "B": "Blue", "G": "Green", "SM": "Smoke", "W": "White",
    "BL": "Black", "BR": "Brown", "TA": "Tan", "GR": "Gray",
    "R": "Red", "P": "Pink"
};

document.addEventListener('DOMContentLoaded', getClothesColorsAndDescription);
function getClothesColorsAndDescription(){
    colorSelect.innerText = '';

    fetch(`/get-clothes-colors-descr`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clothes_id: productClothID
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {;
        const colors = data.colors
        for(var i = 0; i < colors.length; i++){
            var option = document.createElement("option");
            option.value = colors[i][0];
            option.text = colorvalColornameMap[colors[i][0]];
            if(colors[i][0] === productInitColor)  // initially selected color
                option.selected = true;
            colorSelect.appendChild(option);
        }
        document.getElementById("product-description").innerText = data.descr;

        getClothesSizes();  // after getting colors, sizes needed to be fetched once
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// when clothes color change, change image 
colorSelect.addEventListener("change", changeClothesImage);
function changeClothesImage(){
    fetch(`/change-clothes-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clothes_id: productClothID,
            color: colorSelect.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {;
        var productImg = document.getElementById("product-img");
        productImg.src = data["image_src"];
    })
    .catch(error => {
        console.error('Error:', error);
        // alert("An error occurred while loading clothes image.");
    });
}


var sizeSelect = document.getElementById("size");
colorSelect.addEventListener("change", getClothesSizes);
function getClothesSizes(){
    sizeSelect.innerText = '';

    fetch(`/get-clothes-sizes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clothes_id: productClothID,
            color: colorSelect.value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const sizes = data.sizes
        for(var i = 0; i < sizes.length; i++){
            var option = document.createElement("option");
            option.value = sizes[i];
            option.text = sizes[i];
            sizeSelect.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}