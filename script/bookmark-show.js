// Get user ID from localStorage
const userId = localStorage.getItem("id");

if (!userId) {
    alert("No user ID found. Please log in again.");
    window.location.href = "login.html"; // Redirect to login page if user ID is missing

}

// Fetch user bookmarks from the backend
fetch(`http://localhost:8080/api/bookmark/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        const userBookmarkContainer = document.getElementById("userbookmark");

        // Clear previous content (if any)
        userBookmarkContainer.innerHTML = "";

        if (data.length === 0) {
            // Display a message if no bookmarks are found
            const noBookmarkMessage = document.createElement("p");
            noBookmarkMessage.textContent = "No bookmarks found. Start adding your favorite content!";
            noBookmarkMessage.classList.add("no-bookmark-message");
            userBookmarkContainer.appendChild(noBookmarkMessage);
            return;
        }

        // Iterate through the bookmarks and display each one
        data.forEach(bookmark => {
            const bookmarkCard = document.createElement("div");
            bookmarkCard.classList.add("bookmark-card");

            bookmarkCard.innerHTML = `
                <div><img src="${bookmark.thumbnail_url}" alt="${bookmark.title}" width="100" height="100"></div>
                <div>
                    <h3>${bookmark.title}</h3>
                    <p>${bookmark.description}</p>
                </div>
            `;

            userBookmarkContainer.appendChild(bookmarkCard);
        });
    })
    .catch(error => {
        console.error("Error loading bookmarks:", error);
        alert("Error loading bookmarks. Please try again later.");
    });
