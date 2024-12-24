// document.getElementById("submit-button").addEventListener("click", SignIn);

async function SignIn() {
    const fname = document.getElementById('first-name').value.trim();
    const lname = document.getElementById('last-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const bdate = document.getElementById('birthday').value.trim();
    const gender = document.getElementById('gender').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirm_password = document.getElementById('confirm-password').value.trim();
    if (confirm_password != password) {
        alert("enter confirm password again!!");
        return;
    }

    console.log(document.getElementById('birthday').value);
    const data = {
        fname: fname,
        lname: lname,
        phone: phone,
        email: email,
        bdate: bdate,
        gender: gender,
        password: password
    };
    console.log(data);
    try {
        const response = await fetch(`${serverURL}/signin_`, {
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
            window.location.href = '/login';
        } 
    //     else {
    //         console.error('Failed to sign up:', response.status, response.statusText);
    //     }
    } catch (error) {
        // console.error('Error:', error);
    }
  }