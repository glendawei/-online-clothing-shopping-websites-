document.addEventListener('DOMContentLoaded', getCachedTryonImage);

document.getElementById("try-on-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    // prevent repeated submission
    document.getElementById("tryon-submit-btn").disabled = true;
    document.getElementById("processing-section").style.display = "block";
    
    // clear previous result
    var resultSection = document.getElementById("result-section");
    var processedImage = document.getElementById("processed-image");
    processedImage.src = "";
    resultSection.style.display = "none";

    // get user image
    const fileInput = document.getElementById("upload-image");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please upload an image!");
        return;
    }

    // get parameters
    const urlParams = new URLSearchParams(window.location.search);
    var formData = new FormData();
    formData.append('user-image', file);
    formData.append('clothes-id', urlParams.get('cloth_id'));
    formData.append('color', urlParams.get('color'));
    formData.append('product-img-path', urlParams.get('img'));
    fetch(`/try-on`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            alert("Failed to try on. Please try again.");
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        document.getElementById("processing-section").style.display = "none";
        document.getElementById("tryon-submit-btn").disabled = false;
        return response.json();
    })
    .then(data => {
        processedImage.src = data.tryon_image;
        resultSection.style.display = "block";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while trying on.");
    });
});


function getCachedTryonImage(){
    const urlParams = new URLSearchParams(window.location.search);
    var resultSection = document.getElementById("result-section");
    var processedImage = document.getElementById("processed-image");
    
    fetch(`/try-on-query-cache`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clothes_id: urlParams.get('cloth_id'),
            color: urlParams.get('color')
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {;
        if(data.cached === 1){
            processedImage.src = data.tryon_image;
            resultSection.style.display = "block";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}