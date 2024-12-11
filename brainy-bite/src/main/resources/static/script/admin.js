// Function to check if the user is logged in
function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

// Add event listener for the image input to preview the image
document.getElementById("articleImageInput").addEventListener("change", function () {
    const fileInput = this;
    const previewImage = document.getElementById("preview");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Set the src of the img tag to the selected image
            previewImage.src = e.target.result;
            previewImage.style.display = "block"; // Make the image visible
        };

        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // Hide the image if no file is selected
        previewImage.style.display = "none";
    }
});


// Add event listener for the confirm button to submit the form
document.getElementById("confirmButton").addEventListener("click", function () {
    const formdata = new FormData();
    const fileInput = document.getElementById("articlePDFInput");
    const imageInput = document.getElementById("articleImageInput");
    const author = localStorage.getItem("username");

    // Append selected files
    formdata.append("pdfFile", fileInput.files[0]);
    formdata.append("imageFile", imageInput.files[0]);

    // Append other data
    formdata.append("data", JSON.stringify({
        //"author": document.getElementById("articleAuthorInput").value,
        "author": author,
        "category": document.getElementById("articleCategory").value,
        "title": document.getElementById("articleTitleInput").value,
        "description": document.getElementById("articleDescriptionInput").value,
        "status": "pending"
    }));

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    fetch("/api/v1/upload/pending", requestOptions)
        .then(response => {
            if (response.status === 201) {
                // If POST is successful
                alert("การส่งข้อมูลสำเร็จ!");
                clearForm();  // Reset the form
            } else {
                throw new Error("เกิดข้อผิดพลาดในการส่งข้อมูล");
            }
        })
        .catch(error => {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        });
});

// Function to clear the form
function clearForm() {
    // Clear input fields
    document.getElementById("articleImageInput").value = "";
    document.getElementById("articlePDFInput").value = "";
    document.getElementById("articleTitleInput").value = "";
    document.getElementById("articleAuthorInput").value = "";
    document.getElementById("articleDescriptionInput").value = "";
    document.getElementById("articleCategory").selectedIndex = 0;

    // Clear image preview
    document.getElementById("imagePreview").innerHTML = "";
}
