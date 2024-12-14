// Get user ID from localStorage
const userId = localStorage.getItem("id");

if (!userId) {
    alert("No user ID found. Please log in again.");
    window.location.href = "login.html"; // Redirect to login page if user ID is missing
}

// Fetch user bookmarks from the backend
fetch(`/api/bookmark/${userId}`)
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
                <div class="thumbnail">
                    <img src="${bookmark.thumbnail_url}" alt="${bookmark.title}" width="100" height="100">
                </div>
                <div class="bookmark-details">
                    <h3 class="article-title">${bookmark.title}</h3>
                    <p>${bookmark.description}</p>
                </div>
            `;

            // Add event listener for thumbnail click
            bookmarkCard.querySelector(".thumbnail img").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${bookmark.article_id}`;
            });

            // Add event listener for title click
            bookmarkCard.querySelector(".article-title").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${bookmark.article_id}`;
            });

            userBookmarkContainer.appendChild(bookmarkCard);
        });
    })
    .catch(error => {
        console.error("Error loading bookmarks:", error);
        const userBookmarkContainer = document.getElementById("userbookmark");
        userBookmarkContainer.innerHTML = '<p class="error-message">Error loading bookmarks. Please try again later.</p>';
    });
