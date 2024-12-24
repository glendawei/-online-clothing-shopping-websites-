document.querySelectorAll(".save-change").forEach((button) => {
    button.addEventListener("click", () => {
        const status = button.id; // 直接使用按鈕的 id 作為 status
        LoadOrders(status);
    });
});

window.onload = () => {
    LoadUserName();
    LoadOrders("p");
};

 
//     try {
        
//         const response = await fetch(`/user_orders_load_orders?user_id=${get_user_id()}&status=${'p'}`, {
//             method: 'GET',
//         });

//         if (response.ok) {
//             const orders = await response.json();
//             console.log(orders); // 用於測試的輸出
//             RenderOrders(orders); // 渲染訂單資料到頁面
//         } else {
//             console.error(`Failed to load orders: ${response.status} - ${response.statusText}`);
//         }
//     } catch (error) {
//         console.error("Error loading orders:", error);
//     }
// }

async function LoadOrders(status) {
    try {
        // const userId = get_user_id();
        // if (!userId) {
        //     console.error("User ID not found.");
        //     return;
        // }

        const response = await fetch(`/user_orders_load_orders?user_id=${get_user_id()}&status=${status}`, {
            method: 'GET',
        });

        if (response.ok) {
            const orders = await response.json();
            console.log(orders); // 用於測試的輸出
            RenderOrders(orders); // 渲染訂單資料到頁面
        } else {
            console.error(`Failed to load orders: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        // console.error("Error loading orders:", error);
    }
}

function RenderOrders(orders) {
    const ordersContainer = document.getElementById("order-list"); // 容器來顯示訂單
    ordersContainer.innerHTML = ""; // 清空舊內容

    orders.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order-card");
        orderElement.innerHTML = `
            <img src="..${order.path}" alt="${order.name}">
            <div class="order-details">
                <p>Order ID: ${order.order_id}</p>
                <h2>${order.name}</h2>
                <p>Size: ${order.size}</p>
                <p>Color: ${order.color}</p>
                <p>Order Date: ${order.order_date}</p>
                <p>Ideal Received Date: ${order.ideal_rcv_date}</p>
                <p>Price: ${order.price}</p>
                <p>Purchase Quantity: ${order.purchase_qty}</p>
                <p class="price">${order.sub_total} NTD</p>
                <div id="full-details" style="display: none;">
                    <p>Payment Type: ${order.payment_type}</p>
                    <p>Shipping Fee: ${order.shipping_fee}</p>
                    <p>Description: ${order.description}</p>
                </div>
                <!-- <button class="more-details">More Details</button> -->
            </div>
        `;
        ordersContainer.appendChild(orderElement);
    });
}
