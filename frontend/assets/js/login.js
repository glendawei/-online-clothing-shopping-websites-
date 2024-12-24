document.getElementById("login-button").addEventListener("click", submitLogin);


function submitLogin() {
    const emailOrPhone = document.getElementById('login-email-or-phone').value.trim();
    const userPassword = document.getElementById('login-password').value.trim();

    if (!emailOrPhone || !userPassword) {
        document.getElementById('login-result').innerText = "Please fill in all fields.";
        return;
    }

    fetch('/submit_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email_or_phone: emailOrPhone,
            user_password: userPassword
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success === 1) {
            // user_id = data.session.user_id;
            localStorage.setItem('user_id', data.session.user_id);
            localStorage.setItem('user_fname', data.session.user_fname);
            localStorage.setItem('user_lname', data.session.user_lname);
            localStorage.setItem('phone', data.session.phone);
            localStorage.setItem('email', data.session.email);
            localStorage.setItem('bdate', data.session.bdate);
            localStorage.setItem('gender', data.session.gender);
            // user_fname = data.session.fname;
            // user_lname = data.session.lname;
            // phone = data.session.phone;
            // email = data.session.email;
            // bdate = data.session.bdate;
            // gender = data.session.gender;
            // changeUserData(data.session.user_id, data.session.user_fname, data.session.user_lname, data.session.phone, data.session.email, data.session.bdate, data.session.gender);
            // console.log(get_user_id());
            document.getElementById('login-result').innerText = "Login Successful!";
            window.location.href = "/";
        } else {
            document.getElementById('login-result').innerText = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('login-result').innerText = "An unexpected error occurred.";
    });
}