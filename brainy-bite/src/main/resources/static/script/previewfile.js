document.getElementById("articleImageInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file
    const preview = document.getElementById("preview");

    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader(); // Initialize FileReader
      reader.onload = function (e) {
        preview.src = e.target.result; // Set the image source to the loaded data
        preview.style.display = "block"; // Display the image
      };
      reader.readAsDataURL(file); // Read the image file as a data URL
    } else {
      alert("Please upload a valid PNG or JPEG image.");
      preview.style.display = "none"; // Hide the preview if invalid file
    }
  });