window.addEventListener("load", LoadUserName);
window.addEventListener("load", LoadUserDetails);
document.getElementById("save-change").addEventListener("click", ChangeUserDetails);

async function LoadUserDetails() {
    try {
        const response = await fetch(`${serverURL}/user_details_load_user_data?user_id=${get_user_id()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is successful
        if (response.ok) {
            const result = await response.json();
            userinfo = result; // Set the result from the API into the products object
            // console.log(userinfo); // Log the response from Flask
            console.log(userinfo.bdate)
            document.getElementById('first-name').value = userinfo.fname;
            document.getElementById('last-name').value = userinfo.lname; 
            document.getElementById('phone').value = userinfo.phone; 
            document.getElementById('email').value = userinfo.email; 
            document.getElementById('birthday').value = userinfo.bdate; 
            document.getElementById('gender').value = userinfo.gender;
        }
        // } else {
        //     console.error("Failed to fetch data:", response.status, response.statusText);
        // }
    } 
    catch (error) {
        // console.error('Error:', error);
    }
};

async function ChangeUserDetails() {

    const fname = document.getElementById('first-name').value.trim();
    const lname = document.getElementById('last-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const bdate = document.getElementById('birthday').value.trim();
    const gender = document.getElementById('gender').value.trim();
    // const password = document.getElementById('password').value.trim();

    const data = {
        user_id: get_user_id(),
        fname: fname,
        lname: lname,
        phone: phone,
        email: email,
        bdate: bdate,
        gender: gender
    };
  
    try {
        const response = await fetch(`${serverURL}/user_details_change_user_data`, {
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
            
            localStorage.setItem('user_fname', fname);
            localStorage.setItem('user_lname', lname);
            localStorage.setItem('phone', phone);
            localStorage.setItem('email', email);
            localStorage.setItem('bdate', bdate);
            localStorage.setItem('gender', gender);
            LoadUserDetails();
            LoadUserName();
        } 
    //     else {
    //         console.error('Failed to sign up:', response.status, response.statusText);
    //     }
    } catch (error) {
        // console.error('Error:', error);
    }
  }