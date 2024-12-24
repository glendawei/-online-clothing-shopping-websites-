// Event listener for logo click to reset the state
const logoLink = document.querySelector(".logo a");

logoLink.addEventListener("click", function (event) {
    // Prevent default behavior of the link (navigation)
    event.preventDefault();

    const currentPage = window.location.pathname;
    console.log(currentPage);
    if (currentPage != '/user_orders' && currentPage != '/user_details' && currentPage != '/user_account_base' && currentPage != '/item' && currentPage != '/try-on' && currentPage != '/signin' && currentPage != '/login'){
        // Reset the selected gender, category, and search input
        selectedGender = null;
        selectedCategory = null;
        // searchInput.value = "";
        if (searchInput && typeof searchInput.value !== "undefined") {
            searchInput.value = "";
        }

        // Clear sessionStorage to reset filters
        sessionStorage.removeItem("filtersState");

        // Remove active classes from gender and category buttons
        navButtons.forEach(button => button.classList.remove("active"));
        categoryButtons.forEach(button => button.classList.remove("active"));

        // Hide category section and show the welcome picture
        categoriesSection.classList.add("hidden");
        toggleWelcomePicture();

        // Reset the display of products (or show welcome message if no filters)
        displayProducts();
    }
    if (currentPage == '/signin' || currentPage == '/login') {
        window.location.href = 'login';
    } else {
        window.location.href = 'category';
    }
});


const serverURL = "http://127.0.0.1:5000";
// var user_id = 0;
let user_id = localStorage.getItem('user_id') || 0;
var user_fname = localStorage.getItem('user_fname') || "";
var user_lname = localStorage.getItem('user_lname') || "";
var phone = localStorage.getItem('phone') || "";
var email = localStorage.getItem('email') || "";
var bdate = localStorage.getItem('bdate') || "";
var gender = localStorage.getItem('gender') || "";

function get_user_id(){
    return localStorage.getItem('user_id')
}

function get_user_fname(){
    return localStorage.getItem('user_fname');
}

function get_user_lname(){
    return localStorage.getItem('user_lname');
}

function get_phone(){
    return localStorage.getItem('phone');
}

function get_email(){
    return localStorage.getItem('email');
}

function get_bdate(){
    return localStorage.getItem('bdate');
}

function get_gender(){
    return localStorage.getItem('gender');
}

function changeUserData(new_user_id, new_user_fname, new_user_lname, new_phone, new_email, new_bdate, new_gender) {
    user_id = new_user_id;
    user_fname = new_user_fname;
    user_lname = new_user_lname;
    phone = new_phone;
    email = new_email;
    bdate = new_bdate;
    gender = new_gender;
}

// Wrap each icon with an <a> tag and set the href attribute
function wrapIconWithLink(icon, href) {
    const link = document.createElement("a");
    link.href = href;

    // Insert the link before the icon and move the icon inside it
    icon.parentNode.insertBefore(link, icon);
    link.appendChild(icon);
}


// Select the icons
if (window.location.pathname != '/signin' && window.location.pathname != '/login') {
    const profileIcon = document.getElementById("profile-icon");
    const likeIcon = document.getElementById("like-icon");
    const bagIcon = document.getElementById("bag-icon");

    // Add links to each icon
    wrapIconWithLink(profileIcon, "user_account_base");
    wrapIconWithLink(likeIcon, "favorite");
    wrapIconWithLink(bagIcon, "bag");
}


// document.getElementById("save-change").addEventListener("click", ChangeUserDetails);

function LoadUserName() {
    // console.log(get_user_id());
    // console.log(get_user_fname());
    // console.log(get_user_lname());
    // console.log(get_phone());
    // console.log(get_email());
    // console.log(get_bdate());
    // console.log(get_gender());
    document.getElementById('first-name-big').innerText = get_user_fname();
    document.getElementById('last-name-big').innerText = get_user_lname(); 
    document.getElementById('First').innerText = get_user_fname().charAt(0).toUpperCase();
    document.getElementById('Last').innerText = get_user_lname().charAt(0).toUpperCase();
    console.log(document.getElementById('Last').innerText);
};