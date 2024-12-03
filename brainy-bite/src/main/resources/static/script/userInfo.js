// Fetch user information from the backend
fetch("http://localhost:8080/api/info/1")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        const userInfoContainer = document.getElementById("userinfo"); // Corrected ID and variable name

        // Clear previous content (if any)
        userInfoContainer.innerHTML = `
            <img src="pic/user.jpg" alt="User" width="150" height="150">
        `;

        // Dynamically add user details
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <h3>${data.username}</h3>
            <p>${data.email}</p>
            <p>${data.bio}</p>
        `;

        userInfoContainer.appendChild(userCard);
    })
    .catch(error => {
        console.error("Error loading user information:", error);
        alert("Error loading user information. Please try again later.");
    });
