Transaction = [];
const urlParams = new URLSearchParams(window.location.search);
const ordered_id = urlParams.get('order_id');
console.log(ordered_id);
window.onload = async function () {
    try {
        const response = await fetch(`${serverURL}/ordered_?ordered_id=${ordered_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Log the response status
        console.log("Response Status: ", response.status);

        // Check if the response is successful (status code 200)
        if (response.ok) {
            const result = await response.json();  // Wait for the JSON response
            console.log("Fetched Data: ", result);

            Transaction = {
                orderid: result.order_id,
                price: result.sub_total + result.shipping_fee,
                address: result.address,
            };

            console.log("Updated Transaction: ", Transaction);

document.getElementById("orderNumber").textContent = Transaction.orderid;
const today = new Date();

// Format the date as YYYY-MM-DD (ISO format)
const formattedDate = today.toISOString().split('T')[0];

// Set the textContent of the element with ID 'orderDate' to today's date
document.getElementById("orderDate").textContent = formattedDate;
// 插入顧客詳細資訊
const customerInfo = document.getElementById("customerInfo");
customerInfo.innerHTML = `

  <p>Address: ${Transaction.address}</p>
  <p>Price: $${Transaction.price}</p>
`;

        } else {
            const result = await response.json();  // Ensure you handle the error response
            console.error("Error fetching order data:", result);
        }
    } catch (error) {
        // Handle any network errors or JSON parsing errors
        console.error("Network error or JSON parsing error:", error);
    }
};


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


// 點擊顯示/隱藏詳細訊息
document.getElementById("detailsButton").addEventListener("click", () => {
  if (customerInfo.classList.contains("hidden")) {
    customerInfo.classList.remove("hidden");
    document.getElementById("detailsButton").textContent = "▲";
  } else {
    customerInfo.classList.add("hidden");
    document.getElementById("detailsButton").textContent = "▼";
  }
});
// <p>Name: ${Transaction[0].firstName} ${Transaction[0].lastName}</p>-->
//<p>Phone: ${Transaction[0].mobile}</p>