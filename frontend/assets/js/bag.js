// 商品數據
// const cartItems = [
//   { id: 1, name: "Blazer", color: "White", size: "M", price: 100, quantity: 2 },
//   { id: 2, name: "Blazer", color: "Black", size: "M", price: 80, quantity: 1 },
//   { id: 3, name: "Blazer", color: "red", size: "M", price: 100, quantity: 2 },
//   { id: 4, name: "Blazer", color: "pink", size: "M", price: 80, quantity: 1 },
// ];

cartItems = []
window.onload = async function () {
  try {
      const response = await fetch(`${serverURL}/bag_load_bag?user_id=${get_user_id()}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      
      // Check if the response is successful
      if (response.ok) {
          const result = await response.json();
          cartItems = result;
          console.log(cartItems); // Log the response from Flask
          renderCart();
      } else {
          console.error("Failed to fetch data:", response.status, response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  }
};

// 初始化購物車
const cartContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("subtotal");

function renderCart() {
cartContainer.innerHTML = ""; // 清空購物車
let subtotal = 0;

cartItems.forEach((item) => {
  console.log("no");
  subtotal += item.price * item.quantity;

  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");

  cartItem.innerHTML = `
    <div class="item-details">
      <img src=${".." + item.img} alt="${item.name}">
      <ul>
        <li>ITEM NAME: ${item.name}</li>
        <li>ITEM STYLE: (${item.color}, ${item.size})</li>
        <li>QTY: ${item.quantity}</li>
      </ul>
    </div>
    <div class="item-actions">
      <p>NTD ${item.price}</p>
      <button class="remove-btn" data-id="${item.id}">X</button>
    </div>
  `;
  cartContainer.appendChild(cartItem);
});

subtotalElement.textContent = subtotal;
}

async function deleteItemFromBag(user_id_d, clothes_id, color, size) {
  const data = {
      user_id: user_id_d,
      clothes_id: clothes_id,
      color: color,
      size: size
  };

  try {
      const response = await fetch(`${serverURL}/bag_delete_item`, {
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

// 移除商品功能
cartContainer.addEventListener("click", (e) => {
if (e.target.classList.contains("remove-btn")) {
  const id = parseInt(e.target.dataset.id);
  const index = cartItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    deleteItemFromBag(get_user_id(), cartItems[index].id, cartItems[index].color, cartItems[index].size);
    cartItems.splice(index, 1); // 移除商品
    renderCart();
  }
}
});
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


// 初始化購物車畫面
renderCart();
document.getElementById("checkout-btn").addEventListener("click", () => {
    if(cartItems.length != 0){
        window.location.href = "checkout"; // 這裡將導向結帳頁面
    }
});