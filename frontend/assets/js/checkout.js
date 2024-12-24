// 購物車資料
// const cartItems = [
//     { id: 1, name: "Blazer", color: "White", size: "M", price: 100, quantity: 2 },
//     { id: 2, name: "Blazer", color: "Black", size: "M", price: 80, quantity: 1 },
// ];
cartItems = []


const defaultAddress = {
    firstName: 'John',
    lastName: 'Doe',
    mobile: '1234567890',
    address: 'Insert Your Own Address'
  };

/*如果你需要讀取 HTML 內容，可以用 getElementById 搭配 innerText 或 textContent。
如果你需要傳內容到 HTML，可以用 getElementById 搭配屬性（如 innerText）來修改。*/
// 初始化購物車
function loadCartItems() {
    const cartContainer = document.getElementById("cart-items");
    const itemCount = document.getElementById("itemcount");
    const subtotalElem = document.getElementById("subtotal");

    let subtotal = 0; // 總金額
    let count = 0; // 總商品數量
    
    // 清空目前的內容
    cartContainer.innerHTML = "";

    // 迭代購物車商品
    cartItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        // 只顯示商品圖片
        itemDiv.innerHTML = `
            <div class="itempic">
                <img src=${".." + item.img} alt="${item.name}">
            </div>
        `;

        cartContainer.appendChild(itemDiv);

        // 計算商品數量（但不顯示價格）
        subtotal += item.price * item.quantity;
        count += item.quantity;
    });
    
    // 更新商品總數
    itemCount.innerText = count;

    // 更新小計與總付款金額（即使不顯示價格，仍更新內部邏輯）
    subtotalElem.innerText = subtotal;
    updateTotal();
}

// 更新總付款金額


function updateTotal() {
    const subtotal = parseInt(document.getElementById("subtotal").innerText, 10);
    const shippingCost = document.querySelector('input[name="shipping"]:checked') ? parseInt(document.querySelector('input[name="shipping"]:checked').value, 10) : 0; 
    const totalAmount = subtotal + shippingCost;

    // 更新顯示的數值
    document.getElementById("sub-total").innerText = subtotal;
    document.getElementById("totalAmount").innerText = totalAmount;
    document.getElementById("shipping-fee").innerText = shippingCost;
}

// 模擬購買功能


// 初始化頁面，顯示預設地址
function loadDefaultAddress() {
    document.getElementById('display-name').textContent = `${get_user_fname()} ${get_user_lname()}`;
    document.getElementById('display-address').textContent = defaultAddress.address;
    document.getElementById('display-mobile').textContent = get_phone();
    document.getElementById('display-email').textContent = get_email();
    document.getElementById('first-name').value = get_user_fname();
    document.getElementById('last-name').value = get_user_lname();
    document.getElementById('address').value = defaultAddress.address;
    document.getElementById('mobile').value = get_phone();
    document.getElementById('email').value = get_email();
};

// 顯示表單並隱藏顯示的地址
function showForm() {
    // 隱藏地址顯示
    document.getElementById('address-display').style.display = 'none';
    // 顯示表單
    document.getElementById('address-form').style.display = 'block';

    // 填充表單內容為預設地址資料
    // document.getElementById('first-name').value = defaultAddress.firstName;
    // document.getElementById('last-name').value = defaultAddress.lastName;
    // document.getElementById('address').value = defaultAddress.address;
    // document.getElementById('mobile').value = defaultAddress.mobile;
    // document.getElementById('email').value = 'example@email.com';  // 如果有，填充email欄位
}

// 保存地址並更新顯示
function saveAddress() {
    // 獲取表單的值
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const address = document.getElementById('address').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;

    // 更新顯示的地址
    document.getElementById('display-name').innerText = `${firstName} ${lastName}`;
    document.getElementById('display-address').innerText = address;
    document.getElementById('display-mobile').innerText = mobile;
    document.getElementById('display-email').innerText = email;

    // 隱藏表單並顯示更新後的地址
    document.getElementById('address-display').style.display = 'block';
    document.getElementById('address-form').style.display = 'none';
}
function showcForm(paymentMethod) {
    // Hide all forms and summary
    const forms = document.querySelectorAll('.payment-form');
    forms.forEach(form => form.style.display = 'none');

    // Hide all summary sections
    const summaries = document.querySelectorAll('.payment-method-summary');
    summaries.forEach(summary => summary.style.display = 'none');

    // Show the selected form
    document.getElementById(paymentMethod).style.display = 'block';
}
function saveInfo(paymentMethod) {
    let summaryElement = '';
    if (paymentMethod === 'visa') {
        const visaNumber = document.getElementById('visa-number').value;
        const visaExpiry = document.getElementById('visa-expiry').value;
        const visaCvc = document.getElementById('visa-cvc').value;

        // Set the summary information
        document.getElementById('visa-number-info').innerText = visaNumber;
        document.getElementById('visa-expiry-info').innerText = visaExpiry;
        document.getElementById('visa-cvc-info').innerText = visaCvc;

        // Show the Visa summary
        summaryElement = document.getElementById('visa-summary');
    } else if (paymentMethod === 'mastercard') {
        const mastercardNumber = document.getElementById('mastercard-number').value;
        const mastercardExpiry = document.getElementById('mastercard-expiry').value;
        const mastercardCvc = document.getElementById('mastercard-cvc').value;

        // Set the summary information
        document.getElementById('mastercard-number-info').innerText = mastercardNumber;
        document.getElementById('mastercard-expiry-info').innerText = mastercardExpiry;
        document.getElementById('mastercard-cvc-info').innerText = mastercardCvc;

        // Show the MasterCard summary
        summaryElement = document.getElementById('mastercard-summary');
    } else if (paymentMethod === 'paypal') {
        const paypalEmail = document.getElementById('paypal-email').value;

        // Set the summary information
        document.getElementById('paypal-email-info').innerText = paypalEmail;

        // Show the PayPal summary
        summaryElement = document.getElementById('paypal-summary');
    }

    // Show the selected payment method's summary
    summaryElement.style.display = 'block';

    // Hide the form
    document.getElementById(paymentMethod + '-form').style.display = 'none';

    // Show the payment summary section
    document.getElementById('payment-summary').style.display = 'block';
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

  function getSelectedPaymentType() {
    // Get all radio buttons with the name "payment-type"
    const paymentOptions = document.getElementsByName('payment-type');

    // Loop through the options to find the selected one
    for (const option of paymentOptions) {
        if (option.checked) {
            return option.value; // Return the value of the selected option
        }
    }

    // If no option is selected, return null or a default value
    return null;
}

async function checkout() {
    const sub_total = parseInt(document.getElementById("subtotal").innerText, 10);
    const shipping_fee = document.querySelector('input[name="shipping"]:checked') ? parseInt(document.querySelector('input[name="shipping"]:checked').value, 10) : 0; 
    const address = document.getElementById('address').value;
    const payment_type = getSelectedPaymentType();
    console.log(address)
    console.log(payment_type)
    // Create the data object to send
    const data = {
        user_id: get_user_id(),
        sub_total: sub_total,
        shipping_fee: shipping_fee,
        payment_type: payment_type,
        address: address
    };

    try {
        // Send a POST request with the data as JSON
        const response = await fetch(`${serverURL}/checkout_`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Convert the data to JSON format
        });

        const result = await response.json();
        // Check if the response is successful
        if (response.ok) {
            console.log(result.order_id);  // Log the success message from the server
            window.location.href = `ordered?order_id=${encodeURIComponent(result.order_id)}`;
        } else {
            console.error('Failed to process checkout:', response.status, response.statusText);
            alert(`Failed to process checkout: ${result.error}`);
        }
    } catch (error) {
        console.error('Error during checkout:', error);
    }
}

// 合併初始化邏輯
window.onload = async function() {
    try {
        const response = await fetch(`${serverURL}/checkout_load_bag?user_id=${get_user_id()}`, {
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
            // Call the existing functions
            loadDefaultAddress();
            loadCartItems(); // Make sure to load the cart items after fetching data
            updateTotal(); // 確保頁面加載時就計算一次總金額
        } else {
            console.error("Failed to fetch data:", response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


document.getElementById("buy-now").addEventListener("click", () => {
    const subtotal = parseInt(document.getElementById("subtotal").innerText, 10);
    if (subtotal != 0){
        checkout();
    //window.location.href = "ordered"; // 這裡將導向結帳頁面
    }
  });


  // show visa form initially
  document.addEventListener('DOMContentLoaded', showcForm('visa-form'));